import Joi from 'joi';
import moment from 'moment';
import { Sequelize } from 'sequelize';
import { updateStockHelper } from '../helpers/book.helper';
import { updateBorrowedHelper } from '../helpers/member.helper';
import pagination from '../helpers/pagination.helper';
import response from '../helpers/response.helper';
import { Book, BorrowTransaction, db, Member } from '../models';

const BookController = {
  async list(req, res, next) {
    try {
      const { offset, limit } = pagination(req);

      const { count, rows } = await Book.findAndCountAll({
        attributes: ['code', 'title', 'author', 'stock_available'],
        order: [['code', 'asc']],
        offset,
        limit
      });

      return response({
        res, data: {
          count, rows
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async borrowBook(req, res, next) {
    try {
      // validate input
      try {
        const schema = Joi.object({
          book_code: Joi.string().required().error(new Error('Invalid book_code input')),
          member_code: Joi.string().required().error(new Error('Invalid member_code input')),
        });

        await schema.validateAsync(req.body);
      } catch (error) {
        return response({ res, message: error.message, code: 400 });
      }

      await db.transaction(async dbTrx => {
        // validate book and member
        let [book, member] = await Promise.all([
          Book.findOne({
            attributes: ['id', 'code', 'title', 'author', 'stock_available'],
            where: {
              code: req.body.book_code
            },
          }, {
            lock: true
          }),
          Member.findOne({
            attributes: ['id', 'code', 'name', 'active_borrowed_count', 'penalized_end_date'],
            where: {
              code: req.body.member_code
            },
            include: [
              {
                model: BorrowTransaction,
                required: false,
                attributes: ['book_id'],
                where: {
                  status: 'active'
                },
                include: [
                  {
                    model: Book,
                    required: true,
                    attributes: [],
                    where: {
                      code: req.body.book_code
                    }
                  }
                ]
              }
            ]
          }, {
            lock: true
          })
        ]);

        if (!book) {
          return response({ res, message: 'book_code not found', code: 404 });
        } else if (book.stock_available <= 0) {
          return response({ res, message: 'Book stock unavailable', code: 422 });
        }

        if (!member) {
          return response({ res, message: 'member_code not found', code: 404 });
        } else if (member.active_borrowed_count >= 2) {
          return response({ res, message: 'Exceeding the maximum limit for active borrowed book', code: 422 });
        } else if (new Date(member.penalized_end_date) > new Date()) {
          return response({ res, message: 'Member is currently being penalized until ' + (new Date(member.penalized_end_date)).toLocaleString(), code: 422 });
        } else if (member.borrow_transactions.length > 0) {
          return response({ res, message: 'Book already borrowed, please return it before reborrowing', code: 422 });
        }

        // insert borrow transaction
        const borrowTransaction = await BorrowTransaction.create({
          code: Sequelize.literal(`concat(
              to_char(now(), 'YYMMDD'),
              '-',
              (
                select lpad((coalesce(count(*), 0) + 1)::text, 4, '0')
                from borrow_transactions
                where created_at >= now()::date
              )
            )`),
          book_id: book.id,
          member_id: member.id
        });

        // update stock available in book and active borrowed count in member
        const [stockAvailable, activeBorrowedCount] = await Promise.all([
          updateStockHelper(book.id),
          updateBorrowedHelper(member.id)
        ]);

        // tidy up response
        delete book.dataValues.id;
        delete member.dataValues.id;
        delete member.dataValues.borrow_transactions;
        book.stock_available = stockAvailable;
        member.active_borrowed_count = activeBorrowedCount;

        return response({
          res, data: {
            borrow_code: borrowTransaction.code,
            book: book,
            member: member
          }
        });
      });
    } catch (error) {
      // catch db validation error when available stock < 0
      if (error.name == 'SequelizeDatabaseError') {
        return response({ res, message: 'Book stock unavailable or error while processing data', code: 422 });
      }

      next(error);
    }
  },

  async returnBorrowedBook(req, res, next) {
    try {
      // validate input
      try {
        const schema = Joi.object({
          borrow_code: Joi.string().required().error(new Error('Invalid borrow_code input'))
        });

        await schema.validateAsync(req.body);
      } catch (error) {
        return response({ res, message: error.message, code: 400 });
      }

      await db.transaction(async dbTrx => {
        // validate borrow transaction
        let borrowTransaction = await BorrowTransaction.findOne({
          attributes: ['id', 'status', 'code', 'created_at'],
          where: {
            code: req.body.borrow_code
          },
          include: [
            {
              model: Book,
              attributes: ['id', 'code', 'title', 'author',]
            },
            {
              model: Member,
              attributes: ['id', 'code', 'name', 'penalized_end_date']
            }
          ]
        }, {
          lock: true
        });

        if (!borrowTransaction) {
          return response({ res, message: 'borrow_code not found', code: 404 });
        } else if (borrowTransaction.status != 'active') {
          return response({ res, message: 'Book already returned', code: 422 });
        }

        // update borrow transaction status
        borrowTransaction = await borrowTransaction.update({
          status: 'finished',
          return_date: new Date()
        });

        // update stock available in book and active borrowed count in member also create penalty if needed
        const [stockAvailable, activeBorrowedCount, penalizedDate] = await Promise.all([
          updateStockHelper(borrowTransaction.book.id),
          updateBorrowedHelper(borrowTransaction.member.id),
          moment.duration(moment(borrowTransaction.return_date).diff(moment(borrowTransaction.created_at))).asDays() > 7 ?
            db.query(`
              update members
              set penalized_end_date = coalesce(penalized_end_date, now()) + interval '3d',
              updated_at = now()
              where id = :member_id returning penalized_end_date
              `,
              {
                replacements: {
                  member_id: borrowTransaction.member.id
                }
              }) :
            null
        ]);

        // tidy up response
        delete borrowTransaction.book.dataValues.id;
        delete borrowTransaction.member.dataValues.id;
        borrowTransaction.book.stock_available = stockAvailable;
        borrowTransaction.member.active_borrowed_count = activeBorrowedCount;
        if (penalizedDate && penalizedDate[0]?.[0]?.penalized_end_date) {
          borrowTransaction.member.penalized_end_date = penalizedDate[0]?.[0]?.penalized_end_date;
        }

        return response({
          res, data: {
            borrow_code: borrowTransaction.code,
            book: borrowTransaction.book,
            member: borrowTransaction.member
          }
        });
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = BookController;
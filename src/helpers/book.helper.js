import { db } from '../models';

const BookHelper = {
  async updateStockHelper(bookId) {
    // always wrap this function inside db transaction

    const book = await db.query(`
        update books
        set stock_available = stock - (
          select coalesce(count(bt.id), 0)
          from borrow_transactions bt where book_id = :book_id and status = 'active'
        ),
        updated_at = now()
        where id = :book_id returning stock_available
        `,
      {
        replacements: {
          book_id: bookId
        }
      });

    return book[0]?.[0]?.stock_available ?? 0;;
  }
};

module.exports = BookHelper;
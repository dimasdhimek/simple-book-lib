import pagination from '../helpers/pagination.helper';
import response from '../helpers/response.helper';
import { Member } from '../models';

const MemberController = {
  async list(req, res, next) {
    try {
      const { offset, limit } = pagination(req);

      const { count, rows } = await Member.findAndCountAll({
        attributes: [
          'code', 'name', 'active_borrowed_count', 'penalized_end_date'
        ],
        order: [['code', 'asc']],
        offset,
        limit,
      });

      return response({ res, data: { count, rows } });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = MemberController;
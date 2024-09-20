import { db } from '../models';

const MemberHelper = {
  async updateBorrowedHelper(memberId) {
    // always wrap this function inside db transaction

    const member = await db.query(`
        update members
        set active_borrowed_count = (
          select coalesce(count(bt.id), 0)
          from borrow_transactions bt where member_id = :member_id and status = 'active'
        ),
        updated_at = now()
        where id = :member_id returning active_borrowed_count
        `,
      {
        replacements: {
          member_id: memberId
        }
      });

    return member[0]?.[0]?.active_borrowed_count ?? 0;;
  }
};

module.exports = MemberHelper;
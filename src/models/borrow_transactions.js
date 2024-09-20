import { DataTypes } from "sequelize";

module.exports = (db) => {
  const BorrowTransaction = db.define(
    'borrow_transaction',
    {
      id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      status: {
        type: DataTypes.ENUM('active', 'finished', 'cancelled'),
        allowNull: false,
        defaultValue: 'active',
      },
      return_date: {
        type: 'TIMESTAMPTZ',
      },
      member_id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        references: {
          model: {
            tableName: 'members',
          },
          key: 'id'
        },
      },
      book_id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        references: {
          model: {
            tableName: 'books',
          },
          key: 'id'
        },
      }
    },
    {
      tableName: 'borrow_transactions',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
  );

  BorrowTransaction.associate = (models) => {
    BorrowTransaction.belongsTo(models.Member, { foreignKey: 'member_id' });
    BorrowTransaction.belongsTo(models.Book, { foreignKey: 'book_id' });
  };

  return BorrowTransaction;
};
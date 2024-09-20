import { DataTypes } from "sequelize";

module.exports = (db) => {
  const Book = db.define(
    'book',
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      stock_available: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      tableName: 'books',
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
  );

  Book.associate = (models) => {
    Book.hasMany(models.BorrowTransaction, { foreignKey: 'book_id' });
  };

  return Book;
};
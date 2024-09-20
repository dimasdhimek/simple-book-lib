import { DataTypes } from "sequelize";

module.exports = (db) => {
  const Member = db.define(
    'member',
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      active_borrowed_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      penalized_end_date: {
        type: 'TIMESTAMPTZ',
      },
    },
    {
      tableName: 'members',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );

  Member.associate = (models) => {
    Member.hasMany(models.BorrowTransaction, { foreignKey: 'member_id' });
  };

  return Member;
};
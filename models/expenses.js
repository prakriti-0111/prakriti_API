'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.reasons, {
        foreignKey: "reason_id",
        as: "reason"
      });
      this.belongsTo(models.users, {
        foreignKey: "user_id",
        as: "user"
      });
    }
  }
  Expense.init({
    user_id: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER,
    type: DataTypes.STRING,
    reason_id: DataTypes.INTEGER,
    date: DataTypes.DATE,
    description: DataTypes.STRING,
    bill_image: DataTypes.STRING,
    amount: DataTypes.DECIMAL(10, 2),
    explanation: DataTypes.STRING,
    status: DataTypes.STRING,
    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
    },
    updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
    },
    deletedAt: {
        field: 'deleted_at',
        type: DataTypes.DATE,
    }
  }, {
    sequelize,
    paranoid: true,
    modelName: 'expenses',
  });
  return Expense;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LoanDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.loans, {
        foreignKey: "loan_id",
        as: "loan"
      });
    }
  }
  LoanDetail.init({
    loan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'loans',
        key: 'id'
      },
    },
    type: DataTypes.STRING,
    transaction_type: DataTypes.STRING,
    principal_amount: DataTypes.DECIMAL(15,2),
    principal_due_amount: DataTypes.DECIMAL(15,2),
    interest_amount: DataTypes.DECIMAL(15,2),
    emi: DataTypes.DECIMAL(15,2),
    amount: DataTypes.DECIMAL(15,2),
    remaining_balance: DataTypes.DECIMAL(15,2),
    interest_due_date: DataTypes.DATEONLY,
    payment_receive_date: DataTypes.DATE,
    payment_mode: DataTypes.STRING,
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
    modelName: 'loan_details',
  });
  return LoanDetail;
};
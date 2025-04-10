'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Loan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.users, {
        foreignKey: "user_id",
        as: "investor"
      });

      this.hasMany(models.loan_details, {
        foreignKey: {
          name: 'loan_id',
          allowNull: true
        },
        as: 'loanDetails'
      });
    }
  }
  Loan.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
    },
    loan_amount: DataTypes.DECIMAL(15,2),
    principal_amount: DataTypes.DECIMAL(15,2),
    interest: DataTypes.DECIMAL(15,2),
    interest_amount: DataTypes.DECIMAL(15,2),
    interest_display: DataTypes.DECIMAL(15,2),
    interest_display_type: DataTypes.STRING,
    monthly_emi: DataTypes.DECIMAL(15,2),
    total_months:DataTypes.INTEGER,
    due_amount: DataTypes.DECIMAL(15,2),
    total_paid: DataTypes.DECIMAL(15,2),
    start_date: DataTypes.DATEONLY,
    due_date: DataTypes.DATEONLY,
    notes: DataTypes.TEXT,
    status: DataTypes.STRING,
    payment_mode: DataTypes.STRING,
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
    modelName: 'loans',
  });
  return Loan;
};
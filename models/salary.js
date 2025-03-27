'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Salary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.users, {
        foreignKey: "user_id",
        as: "user"
      });
    }
  }
  Salary.init({
    user_id: DataTypes.INTEGER,
    absent: DataTypes.INTEGER,
    work_days: DataTypes.INTEGER,
    gross: DataTypes.DECIMAL(15,2),
    wages: DataTypes.DECIMAL(15,2),
    basic: DataTypes.DECIMAL(15,2),
    hra: DataTypes.DECIMAL(15,2),
    conveyance: DataTypes.DECIMAL(15,2),
    special: DataTypes.DECIMAL(15,2),
    ptax: DataTypes.DECIMAL(15,2),
    epf_employee: DataTypes.DECIMAL(15,2),
    epf_employer: DataTypes.DECIMAL(15,2),
    medical_employee: DataTypes.DECIMAL(15,2),
    medical_employer: DataTypes.DECIMAL(15,2),
    actual_gross: DataTypes.DECIMAL(15,2),
    actual_basic: DataTypes.DECIMAL(15,2),
    absent_amount: DataTypes.DECIMAL(15,2),
    net: DataTypes.DECIMAL(15,2),
    total: DataTypes.DECIMAL(15,2),
    is_epf: DataTypes.BOOLEAN,
    is_medical: DataTypes.BOOLEAN,
    salary_date: DataTypes.DATEONLY,
    status: DataTypes.STRING,
    incentive: DataTypes.DECIMAL(15,2),
    incentive_percent: DataTypes.DECIMAL(10,2),
    incentive_on: DataTypes.DECIMAL(15,2),
    type: DataTypes.STRING,
    paid_amount: DataTypes.DECIMAL(15,2),
    balance: DataTypes.DECIMAL(15,2),
    payment_mode: DataTypes.STRING,
    txn_id: DataTypes.STRING,
    cheque_no: DataTypes.STRING,
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
    modelName: 'salaries',
  });
  return Salary;
};
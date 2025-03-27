'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SalaryStructure extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SalaryStructure.init({
    user_id: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER,
    gross_salary: DataTypes.DECIMAL(10, 2),
    basic_salary: DataTypes.DECIMAL(10, 2),
    eff_date: DataTypes.DATEONLY,
    is_epf: DataTypes.TINYINT(1),
    is_medical: DataTypes.TINYINT(1),
    target: DataTypes.BIGINT,
    visit_target: DataTypes.BIGINT,
    incentive: DataTypes.DECIMAL(10, 2),
    hra_percent: DataTypes.DECIMAL(6, 2),
    conv_percent: DataTypes.DECIMAL(6, 2),
    epf_employee_percent: DataTypes.DECIMAL(6, 2),
    epf_employer_percent: DataTypes.DECIMAL(6, 2),
    medical_employee_percent: DataTypes.DECIMAL(6, 2),
    medical_employer_percent: DataTypes.DECIMAL(6, 2),
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
    modelName: 'salary_structures',
  });
  return SalaryStructure;
};
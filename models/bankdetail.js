'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BankDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BankDetail.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    salary: DataTypes.DECIMAL(10,2),
    bank_name:  DataTypes.STRING,
    account_no:  DataTypes.STRING,
    ifsc_code:  DataTypes.STRING,
    paid_leave:  DataTypes.STRING,
    parent_name:  DataTypes.STRING,
    alternative_no:  DataTypes.STRING,
    alternative_address:  DataTypes.STRING,
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
    modelName: 'bank_details',
  });
  return BankDetail;
};
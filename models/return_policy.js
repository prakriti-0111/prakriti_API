'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReturnPolicy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.categories, {
        foreignKey: "category_id",
        as: "category"
      });
    }
  }
  ReturnPolicy.init({
    category_id: DataTypes.INTEGER,
    role: DataTypes.STRING,
    amount: DataTypes.DECIMAL(15, 2),
    days: DataTypes.INTEGER,
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
    modelName: 'return_policy',
    tableName: 'return_policy'
  });
  return ReturnPolicy;
};
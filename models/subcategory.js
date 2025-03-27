'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.categories, {
        foreignKey: "category_id",
        as: "category"
      });
    }
  }
  SubCategory.init({
    category_id: {
      field: 'category_id',
      type: DataTypes.INTEGER,
      references: {
        model: 'categories',
        key: 'id'
      },
    },
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    hsn_code: DataTypes.STRING,
    making_charge_type: DataTypes.STRING,
    base_price: DataTypes.DECIMAL(15, 2),
    increase: DataTypes.DECIMAL(15, 2),
    making_charge: DataTypes.DECIMAL(15, 2),
    admin_discount: DataTypes.DECIMAL(15, 2),
    distributor_discount: DataTypes.DECIMAL(15, 2),
    retailer_discount: DataTypes.DECIMAL(15, 2),
    customer_discount: DataTypes.DECIMAL(15, 2),
    status: DataTypes.TINYINT,
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
    modelName: 'sub_categories',
  });
  return SubCategory;
};
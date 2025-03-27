'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SaleProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.products, {
        foreignKey: "product_id",
        as: "product"
      });

      this.belongsTo(models.sizes, {
        foreignKey: "size_id",
        as: "size"
      });

      this.hasMany(models.stocks, {
        foreignKey: "product_id",
        sourceKey: 'product_id',
        as: "stock"
      });

      this.hasMany(models.sale_product_materials, {
        foreignKey: {
          name: 'sale_product_id',
          allowNull: true
        },
        as: 'saleMaterials'
      });

    }
  }
  SaleProduct.init({
    sale_id: DataTypes.INTEGER,
    order_product_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    size_id: DataTypes.INTEGER,
    stock_id: DataTypes.INTEGER,
    certificate_no: DataTypes.STRING,
    total_weight: DataTypes.DECIMAL(15, 3),
    sub_price: DataTypes.DECIMAL(15, 2),
    making_charge: DataTypes.DECIMAL(15, 2),
    rep: DataTypes.DECIMAL(15, 2),
    tax: DataTypes.DECIMAL(15, 2),
    cgst_tax: DataTypes.DECIMAL(15, 2),
    sgst_tax: DataTypes.DECIMAL(15, 2),
    igst_tax: DataTypes.DECIMAL(15, 2),
    total: DataTypes.DECIMAL(15, 2),
    //total_amount: DataTypes.DECIMAL(15, 2),
    total_discount: DataTypes.DECIMAL(15, 2),
    making_charge_discount_amount: DataTypes.DECIMAL(15, 2),
    making_charge_discount: DataTypes.DECIMAL(15, 2),
    is_return: DataTypes.BOOLEAN,
    tax_info: DataTypes.STRING,
    making_charge_discount_percent: DataTypes.DECIMAL(15, 2),
    max_making_charge_discount_percent: DataTypes.DECIMAL(15, 2),
    sub_cat_making_charge: DataTypes.DECIMAL(15, 2),
    sub_cat_making_charge_type: DataTypes.STRING,
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
    modelName: 'sale_products',
  });
  return SaleProduct;
};
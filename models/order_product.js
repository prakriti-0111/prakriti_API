'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.products, {
        foreignKey: "product_id",
        as: "product"
      });

      this.belongsTo(models.sizes, {
        foreignKey: "size_id",
        as: "size"
      });

      this.hasMany(models.order_materials, {
        foreignKey: {
          name: 'order_product_id',
          allowNull: true
        },
        as: 'orderProductMaterials'
      });

      this.belongsTo(models.users, {
        foreignKey: "worker_id",
        as: "worker"
      });
    }
  }
  OrderProduct.init({
    order_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    size_id: DataTypes.INTEGER,
    total_weight: DataTypes.DECIMAL(15, 3),
    discount: DataTypes.DECIMAL(15, 2),
    discount_type: DataTypes.STRING,
    certificate_no: DataTypes.STRING,
    rate: DataTypes.DECIMAL(15, 2),
    total: DataTypes.DECIMAL(15, 2),
    quantity: DataTypes.INTEGER,
    making_charge: DataTypes.DECIMAL(15, 2),
    making_charge_discount_amount: DataTypes.DECIMAL(15, 2),
    making_charge_discount_percent: DataTypes.DECIMAL(15, 2),
    total_discount: DataTypes.DECIMAL(15, 2),
    sub_price: DataTypes.DECIMAL(15, 2),
    price_without_tax: DataTypes.DECIMAL(15, 2),
    igst: DataTypes.DECIMAL(15, 2),
    cgst: DataTypes.DECIMAL(15, 2),
    sgst: DataTypes.DECIMAL(15, 2),
    is_return: DataTypes.BOOLEAN,
    old_size_id: DataTypes.INTEGER,
    old_total_weight: DataTypes.DECIMAL(15, 3),
    old_quantity: DataTypes.INTEGER,
    old_discount: DataTypes.DECIMAL(15, 2),
    old_discount_type: DataTypes.STRING,
    old_rate: DataTypes.DECIMAL(15, 2),
    old_making_charge: DataTypes.DECIMAL(15, 2),
    old_making_charge_discount_amount: DataTypes.DECIMAL(15, 2),
    old_making_charge_discount_percent: DataTypes.DECIMAL(15, 2),
    old_total_discount: DataTypes.DECIMAL(15, 2),
    old_sub_price: DataTypes.DECIMAL(15, 2),
    old_price_without_tax: DataTypes.DECIMAL(15, 2),
    old_igst: DataTypes.DECIMAL(15, 2),
    old_cgst: DataTypes.DECIMAL(15, 2),
    old_sgst: DataTypes.DECIMAL(15, 2),
    worker_id: DataTypes.INTEGER,
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
    modelName: 'order_products',
  });
  return OrderProduct;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderMaterial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.materials, {
        foreignKey: "material_id",
        as: "material"
      });

      this.belongsTo(models.units, {
        foreignKey: "unit_id",
        as: "unit"
      });

      this.belongsTo(models.purities, {
        foreignKey: "purity_id",
        as: "purity"
      });
    }
  }
  OrderMaterial.init({
    order_id: DataTypes.INTEGER,
    order_product_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    material_id: DataTypes.INTEGER,
    size_id: DataTypes.INTEGER,
    stock_id: DataTypes.INTEGER,
    purity_id: DataTypes.INTEGER,
    unit_id: DataTypes.INTEGER,
    weight: DataTypes.DECIMAL(15, 3),
    sent_weight: DataTypes.DECIMAL(15, 3),
    quantity: DataTypes.INTEGER,
    sent_quantity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL(15, 2),
    discount: DataTypes.DECIMAL(15, 2),
    discount_type: DataTypes.STRING,
    total: DataTypes.DECIMAL(15, 2),
    rate: DataTypes.DECIMAL(15, 2),
    discount_percent: DataTypes.DECIMAL(15, 2),
    per_gram_price: DataTypes.DECIMAL(15, 2),
    total_gram: DataTypes.DECIMAL(15, 3),
    status: DataTypes.STRING,
    return_qty: DataTypes.INTEGER,
    return_weight: DataTypes.DECIMAL(15, 3),
    old_purity_id: DataTypes.INTEGER,
    old_weight: DataTypes.DECIMAL(15, 3),
    old_quantity: DataTypes.INTEGER,
    old_price: DataTypes.DECIMAL(15, 2),
    old_discount: DataTypes.DECIMAL(15, 2),
    old_discount_type: DataTypes.STRING,
    old_total: DataTypes.DECIMAL(15, 2),
    old_per_gram_price: DataTypes.DECIMAL(15, 2),
    old_discount_percent: DataTypes.DECIMAL(15, 2),
    old_total_gram: DataTypes.DECIMAL(15, 3),
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
    modelName: 'order_materials',
  });
  return OrderMaterial;
};
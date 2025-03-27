'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SaleProductMaterial extends Model {
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
  SaleProductMaterial.init({
    sale_id: DataTypes.INTEGER,
    sale_product_id: DataTypes.INTEGER,
    material_id: DataTypes.INTEGER,
    weight: DataTypes.DECIMAL(15, 3),
    quantity: DataTypes.INTEGER,
    purity_id: DataTypes.INTEGER,
    unit_id: DataTypes.INTEGER,
    rate: DataTypes.DECIMAL(15, 2),
    amount: DataTypes.DECIMAL(15, 2),
    discount_amount: DataTypes.DECIMAL(15, 2),
    discount_percent: DataTypes.DECIMAL(15, 2),
    max_discount_percent: DataTypes.DECIMAL(15, 2),
    total_gram: DataTypes.DECIMAL(15, 3),
    per_gram_price: DataTypes.DECIMAL(15, 2),
    return_qty: DataTypes.INTEGER,
    return_weight: DataTypes.DECIMAL(15, 3),
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
    modelName: 'sale_product_materials',
  });
  return SaleProductMaterial;
};
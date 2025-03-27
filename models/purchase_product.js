'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PurchaseProduct extends Model {
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

      this.hasMany(models.purchase_product_materials, {
        foreignKey: {
          name: 'purchase_product_id',
          allowNull: true
        },
        as: 'purchaseMaterials'
      });

      this.belongsTo(models.purchases, {
        foreignKey: "purchase_id",
        as: "purchase"
      });

    }
  }
  PurchaseProduct.init({
    purchase_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    size_id: DataTypes.INTEGER,
    certificate_no: DataTypes.STRING,
    total_weight: DataTypes.DECIMAL(15, 3),
    sub_price: DataTypes.DECIMAL(15, 2),
    making_charge: DataTypes.DECIMAL(15, 2),
    rate: DataTypes.DECIMAL(15, 2),
    rep: DataTypes.DECIMAL(15, 2),
    tax: DataTypes.DECIMAL(15, 2),
    total: DataTypes.DECIMAL(15, 2),
    current_image:DataTypes.STRING,
    total_discount: DataTypes.DECIMAL(15, 2),
    is_return: DataTypes.BOOLEAN,
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
    modelName: 'purchase_products',
  });
  return PurchaseProduct;
};

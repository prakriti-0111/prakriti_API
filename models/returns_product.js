'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReturnProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.return_product_materials, {
        foreignKey: {
          name: 'return_product_id',
          allowNull: true
        },
        as: 'returnMaterials'
      });
      this.belongsTo(models.purchase_products, {
        foreignKey: "table_id",
        as: "purchaseProduct"
      });
      this.belongsTo(models.sale_products, {
        foreignKey: "table_id",
        as: "saleProduct"
      });
      this.belongsTo(models.order_products, {
        foreignKey: "table_id",
        as: "orderProduct"
      });
      this.belongsTo(models.products, {
        foreignKey: "product_id",
        as: "product"
      });
    }
  }
  ReturnProduct.init({
    return_id: DataTypes.INTEGER,
    table_id: DataTypes.INTEGER,
    table_type: DataTypes.STRING,
    product_id: DataTypes.INTEGER,
    sub_total: DataTypes.DECIMAL(15, 2),
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
    modelName: 'return_products'
  });
  return ReturnProduct;
};
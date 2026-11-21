'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockTransferRequest extends Model {
    static associate(models) {
      this.belongsTo(models.users, {
        foreignKey: "sales_executive_id",
        as: "salesExecutive"
      });
      // who was asked - an admin or the super admin
      this.belongsTo(models.users, {
        foreignKey: "admin_id",
        as: "holder"
      });
      this.belongsTo(models.orders, {
        foreignKey: "order_id",
        as: "order"
      });
    }
  }
  StockTransferRequest.init({
    order_id: DataTypes.INTEGER,
    sales_executive_id: DataTypes.INTEGER,
    admin_id: DataTypes.INTEGER,
    // JSON array of the order items asked for
    order_product_ids: {
      type: DataTypes.TEXT,
      get() {
        try {
          return JSON.parse(this.getDataValue('order_product_ids') || '[]');
        } catch (e) {
          return [];
        }
      },
      set(value) {
        this.setDataValue('order_product_ids', JSON.stringify(value || []));
      },
    },
    stock_ids: {
      type: DataTypes.TEXT,
      get() {
        try {
          return JSON.parse(this.getDataValue('stock_ids') || '[]');
        } catch (e) {
          return [];
        }
      },
      set(value) {
        this.setDataValue('stock_ids', JSON.stringify(value || []));
      },
    },
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
    modelName: 'stock_transfer_requests',
  });
  return StockTransferRequest;
};

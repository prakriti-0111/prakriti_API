'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.order_materials, {
        foreignKey: {
          name: 'order_id',
          allowNull: true
        },
        as: 'orderMaterials'
      });

      this.hasMany(models.order_products, {
        foreignKey: {
          name: 'order_id',
          allowNull: true
        },
        as: 'orderProducts'
      });

      this.belongsTo(models.users, {
        foreignKey: "user_id",
        as: "orderFrom"
      });

      this.belongsTo(models.users, {
        foreignKey: "sales_executive_id",
        as: "saleExecutive"
      });

      this.belongsTo(models.users, {
        foreignKey: "order_by",
        as: "orderBy"
      });
    }
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    to_user_id: DataTypes.INTEGER,
    sales_executive_id: DataTypes.INTEGER,
    order_no: DataTypes.STRING,
    sub_total: DataTypes.DECIMAL(15, 2),
    discount_amount: DataTypes.DECIMAL(15, 2),
    total_amount: DataTypes.DECIMAL(15, 2),
    paid_amount: DataTypes.DECIMAL(15, 2),
    promocode_id: DataTypes.INTEGER,
    promocode: DataTypes.STRING,
    promocode_discount: DataTypes.DECIMAL(15, 2),
    payment_mode: DataTypes.STRING,
    delivery_address: DataTypes.TEXT,
    status: DataTypes.STRING,
    cancel_reason: DataTypes.TEXT,
    accepted_at: DataTypes.DATE,
    shipped_at: DataTypes.DATE,
    out_for_delivery_at: DataTypes.DATE,
    delivered_at: DataTypes.DATE,
    cancelled_at: DataTypes.DATE,
    order_by: DataTypes.INTEGER,
    expected_delivery_date: DataTypes.DATEONLY,
    on_process_at: DataTypes.DATE,
    notes: DataTypes.TEXT,
    image: DataTypes.STRING,
    old_sub_total: DataTypes.DECIMAL(15, 2),
    old_discount_amount: DataTypes.DECIMAL(15, 2),
    old_total_amount: DataTypes.DECIMAL(15, 2),
    on_ready_at: DataTypes.DATE,
    order_from: DataTypes.STRING,
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
    modelName: 'orders',
  });
  return Order;
};
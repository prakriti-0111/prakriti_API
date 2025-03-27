'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Returns extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.purchases, {
        foreignKey: "table_id",
        as: "purchase"
      });
      this.belongsTo(models.sales, {
        foreignKey: "table_id",
        as: "sale"
      });
      this.belongsTo(models.orders, {
        foreignKey: "table_id",
        as: "order"
      });

      this.belongsTo(models.users, {
        foreignKey: "sales_executive_id",
        as: "saleExecutive"
      });

      this.hasMany(models.return_products, {
        foreignKey: {
          name: 'return_id',
          allowNull: true
        },
        as: 'returnProducts'
      });
    }
  }
  Returns.init({
    parent_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    to_user_id: DataTypes.INTEGER,
    sales_executive_id: DataTypes.INTEGER,
    seller_id: DataTypes.INTEGER,
    table_id: DataTypes.INTEGER,
    table_type: DataTypes.STRING,
    notes: DataTypes.TEXT,
    payment_mode: DataTypes.STRING,
    txn_id: DataTypes.STRING,
    cheque_no: DataTypes.STRING,
    status: DataTypes.STRING,
    product_amount: DataTypes.DECIMAL(15, 2),
    charge: DataTypes.DECIMAL(15, 2),
    total_amount: DataTypes.DECIMAL(15, 2),
    accepted_at: DataTypes.DATE,
    declined_at: DataTypes.DATE,
    picked_up_at: DataTypes.DATE,
    cancelled_at: DataTypes.DATE,
    return_date: DataTypes.DATEONLY,
    req_data: DataTypes.TEXT,
    from_retailer_customer: DataTypes.BOOLEAN,
    show_superadmin: DataTypes.BOOLEAN,
    return_amount_from_wallet: DataTypes.DECIMAL(15, 2),
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
    modelName: 'returns',
  });
  return Returns;
};
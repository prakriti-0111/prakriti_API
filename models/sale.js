'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.users, {
        foreignKey: "user_id",
        as: "user"
      });

      this.belongsTo(models.users, {
        foreignKey: "sale_by",
        as: "saleBy"
      });

      this.hasOne(models.purchases, {
        foreignKey: "sale_id",
        sourceKey: "id",
        as: "purchase"
      });

      this.hasMany(models.sale_products, {
        foreignKey: {
          name: 'sale_id',
          allowNull: true
        },
        as: 'saleProducts'
      });

      this.hasMany(models.stocks, {
        foreignKey: {
          name: 'user_id',
          allowNull: true
        },
        sourceKey: 'user_id',
        as: 'saleStocks'
      });

      this.hasMany(models.payments, {
        foreignKey: "table_id",
        constraints: false,
        scope: {
          table_type: 'sale', // optional filter if you use table_type
        },
        as: "payments",
      });

    }
  }
  Sale.init({
    user_id: DataTypes.INTEGER,
    order_id: DataTypes.INTEGER,
    sale_by: DataTypes.INTEGER,
    invoice_number: DataTypes.STRING,
    invoice_date: DataTypes.DATEONLY,
    notes: DataTypes.TEXT,
    payment_mode: DataTypes.STRING,
    transaction_no: DataTypes.STRING,
    report_qty: DataTypes.INTEGER,
    report_charge: DataTypes.DECIMAL(15, 2),
    report_tax_percentage: DataTypes.DECIMAL(15, 2),
    cgst_tax: DataTypes.DECIMAL(15, 2),
    sgst_tax: DataTypes.DECIMAL(15, 2),
    igst_tax: DataTypes.DECIMAL(15, 2),
    discount: DataTypes.DECIMAL(15, 2),
    total_amount: DataTypes.DECIMAL(15, 2),
    paid_amount: DataTypes.DECIMAL(15, 2),
    taxable_amount: DataTypes.DECIMAL(15, 2),
    total_payable: DataTypes.DECIMAL(15, 2),
    due_amount: DataTypes.DECIMAL(15, 2),
    return_amount: DataTypes.DECIMAL(15, 2),
    bill_amount: DataTypes.DECIMAL(15, 2),
    due_date: DataTypes.DATEONLY,
    settlement_date: DataTypes.DATEONLY,
    status: DataTypes.STRING,
    is_approved: DataTypes.INTEGER,
    product_discount: DataTypes.DECIMAL(15, 2),
    total_tag_price: DataTypes.DECIMAL(15, 2),
    req_data: DataTypes.TEXT,
    is_assigned: DataTypes.BOOLEAN,
    is_approval: DataTypes.BOOLEAN,
    accept_declined_at: DataTypes.DATE,
    image: DataTypes.STRING,
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
    modelName: 'sales',
  });
  return Sale;
};
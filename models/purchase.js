'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.users, {
        foreignKey: "supplier_id",
        as: "supplier"
      });

      this.belongsTo(models.sales, {
        foreignKey: "sale_id",
        allowNull: true,
        as: "sale"
      });

      this.belongsTo(models.users, {
        foreignKey: "user_id",
        as: "purchaseBy"
      });

      this.belongsTo(models.users, {
        foreignKey: "added_by",
        as: "addedBy"
      });

      this.hasMany(models.purchase_products, {
        foreignKey: {
          name: 'purchase_id',
          allowNull: true
        },
        as: 'purchaseProducts'
      });

      this.hasMany(models.payments, {
        foreignKey: "table_id",
        constraints: false,
        scope: {
          table_type: 'purchase', // optional filter if you use table_type
        },
        as: "payments",
      });

    }
  }
  Purchase.init({
    supplier_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    added_by: DataTypes.INTEGER,
    sale_id: DataTypes.INTEGER,
    return_id: DataTypes.INTEGER,
    invoice_number: DataTypes.STRING,
    invoice_date: DataTypes.DATEONLY,
    notes: DataTypes.TEXT,
    payment_mode: DataTypes.STRING,
    transaction_no: DataTypes.STRING,
    total_amount: DataTypes.DECIMAL(15, 2),
    tax: DataTypes.DECIMAL(15, 2),
    discount: DataTypes.DECIMAL(15, 2),
    paid_amount: DataTypes.DECIMAL(15, 2),
    taxable_amount: DataTypes.DECIMAL(15, 2),
    bill_amount: DataTypes.DECIMAL(15, 2),
    total_payable: DataTypes.DECIMAL(15, 2),
    due_amount: DataTypes.DECIMAL(15, 2),
    due_date: DataTypes.DATEONLY,
    return_amount: DataTypes.DECIMAL(15, 2),
    is_approved: DataTypes.INTEGER,
    status: DataTypes.STRING,
    req_data: DataTypes.TEXT,
    is_assigned: DataTypes.BOOLEAN,
    is_approval: DataTypes.BOOLEAN,
    accept_declined_at: DataTypes.DATE,
    type: DataTypes.STRING,
    image: DataTypes.STRING,
    current_image:DataTypes.STRING,
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
    modelName: 'purchases',
  });
  return Purchase;
};
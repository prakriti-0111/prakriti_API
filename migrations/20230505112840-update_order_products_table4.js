'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('order_products', 'old_size_id', {
      type: Sequelize.INTEGER,
      after: "is_return"
    });
    await queryInterface.addColumn('order_products', 'old_total_weight', {
      type: Sequelize.DECIMAL(15, 3),
      after: "old_size_id"
    });
    await queryInterface.addColumn('order_products', 'old_quantity', {
      type: Sequelize.INTEGER,
      after: "old_total_weight"
    });
    await queryInterface.addColumn('order_products', 'old_discount', {
      type: Sequelize.DECIMAL(15, 2),
      after: "old_quantity"
    });
    await queryInterface.addColumn('order_products', 'old_discount_type', {
      type: Sequelize.STRING(30),
      after: "old_discount"
    });
    await queryInterface.addColumn('order_products', 'old_rate', {
      type: Sequelize.DECIMAL(15, 2),
      after: "old_discount_type"
    });
    await queryInterface.addColumn('order_products', 'old_making_charge', {
      type: Sequelize.DECIMAL(15, 2),
      after: "old_rate"
    });
    await queryInterface.addColumn('order_products', 'old_making_charge_discount_amount', {
      type: Sequelize.DECIMAL(15, 2),
      after: "old_making_charge"
    });
    await queryInterface.addColumn('order_products', 'old_making_charge_discount_percent', {
      type: Sequelize.DECIMAL(15, 2),
      after: "old_making_charge_discount_amount"
    });
    await queryInterface.addColumn('order_products', 'old_total_discount', {
      type: Sequelize.DECIMAL(15, 2),
      after: "old_making_charge_discount_percent"
    });
    await queryInterface.addColumn('order_products', 'old_sub_price', {
      type: Sequelize.DECIMAL(15, 2),
      after: "old_total_discount"
    });
    await queryInterface.addColumn('order_products', 'old_price_without_tax', {
      type: Sequelize.DECIMAL(15, 2),
      after: "old_sub_price"
    });
    await queryInterface.addColumn('order_products', 'old_igst', {
      type: Sequelize.DECIMAL(15, 2),
      after: "old_price_without_tax"
    });
    await queryInterface.addColumn('order_products', 'old_cgst', {
      type: Sequelize.DECIMAL(15, 2),
      after: "old_igst"
    });
    await queryInterface.addColumn('order_products', 'old_sgst', {
      type: Sequelize.DECIMAL(15, 2),
      after: "old_cgst"
    });
    await queryInterface.addColumn('order_products', 'worker_id', {
      type: Sequelize.INTEGER,
      after: "old_sgst"
    });
    await queryInterface.addColumn('order_products', 'status', {
      type: Sequelize.STRING(30),
      after: "worker_id",
      defaultValue: 'pending'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('order_products', 'old_size_id');
    await queryInterface.removeColumn('order_products', 'old_total_weight');
    await queryInterface.removeColumn('order_products', 'old_quantity');
    await queryInterface.removeColumn('order_products', 'old_discount');
    await queryInterface.removeColumn('order_products', 'old_discount_type');
    await queryInterface.removeColumn('order_products', 'old_rate');
    await queryInterface.removeColumn('order_products', 'old_making_charge');
    await queryInterface.removeColumn('order_products', 'old_making_charge_discount_amount');
    await queryInterface.removeColumn('order_products', 'old_making_charge_discount_percent');
    await queryInterface.removeColumn('order_products', 'old_total_discount');
    await queryInterface.removeColumn('order_products', 'old_sub_price');
    await queryInterface.removeColumn('order_products', 'old_price_without_tax');
    await queryInterface.removeColumn('order_products', 'old_igst');
    await queryInterface.removeColumn('order_products', 'old_cgst');
    await queryInterface.removeColumn('order_products', 'old_sgst');
    await queryInterface.removeColumn('order_products', 'worker_id');
    await queryInterface.removeColumn('order_products', 'status');
  }
};

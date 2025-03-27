'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('order_products', 'making_charge', {
      type: Sequelize.DECIMAL(15, 2),
      after: "rate"
    });
    await queryInterface.addColumn('order_products', 'making_charge_discount_amount', {
      type: Sequelize.DECIMAL(15, 2),
      after: "making_charge"
    });
    await queryInterface.addColumn('order_products', 'making_charge_discount_percent', {
      type: Sequelize.DECIMAL(15, 2),
      after: "making_charge_discount_amount"
    });
    await queryInterface.addColumn('order_products', 'total_discount', {
      type: Sequelize.DECIMAL(15, 2),
      after: "making_charge_discount_percent"
    });
    await queryInterface.addColumn('order_products', 'sub_price', {
      type: Sequelize.DECIMAL(15, 2),
      after: "total_discount"
    });
    await queryInterface.addColumn('order_products', 'price_without_tax', {
      type: Sequelize.DECIMAL(15, 2),
      after: "sub_price"
    });
    await queryInterface.addColumn('order_products', 'igst', {
      type: Sequelize.DECIMAL(15, 2),
      after: "price_without_tax"
    });
    await queryInterface.addColumn('order_products', 'cgst', {
      type: Sequelize.DECIMAL(15, 2),
      after: "igst"
    });
    await queryInterface.addColumn('order_products', 'sgst', {
      type: Sequelize.DECIMAL(15, 2),
      after: "cgst"
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.removeColumn('order_products', 'making_charge');
     await queryInterface.removeColumn('order_products', 'making_charge_discount_amount');
     await queryInterface.removeColumn('order_products', 'making_charge_discount_percent');
     await queryInterface.removeColumn('order_products', 'total_discount');
     await queryInterface.removeColumn('order_products', 'sub_price');
     await queryInterface.removeColumn('order_products', 'price_without_tax');
     await queryInterface.removeColumn('order_products', 'igst');
     await queryInterface.removeColumn('order_products', 'cgst');
     await queryInterface.removeColumn('order_products', 'sgst');
  }
};

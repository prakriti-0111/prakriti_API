'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sale_products', 'making_charge_discount_amount', {
      type: Sequelize.DECIMAL(15,2),
      after: "total_amount"
    });
    await queryInterface.addColumn('sale_products', 'making_charge_discount', {
      type: Sequelize.DECIMAL(15,2),
      after: "making_charge_discount_amount"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('sale_products', 'making_charge_discount_amount');
    await queryInterface.removeColumn('sale_products', 'making_charge_discount');
  }
};

'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sale_products', 'total_discount', {
      type: Sequelize.DECIMAL(15,2),
      after: "total_amount"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('sale_products', 'total_discount');
  }
};

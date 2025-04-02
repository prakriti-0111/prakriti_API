'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sales', 'product_discount', {
      type: Sequelize.DECIMAL(15,2),
      after: "total_amount"
    });
    await queryInterface.addColumn('sales', 'total_tag_price', {
      type: Sequelize.DECIMAL(15,2),
      after: "product_discount"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('sales', 'product_discount');
    await queryInterface.removeColumn('sales', 'total_tag_price');
  }
};

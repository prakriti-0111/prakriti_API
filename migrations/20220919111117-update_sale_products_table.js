'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sale_products', 'stock_id', {
      type: Sequelize.INTEGER,
      after: "size_id"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('sale_products', 'stock_id');
  }
};

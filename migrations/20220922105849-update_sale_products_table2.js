'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sale_products', 'total_weight', {
      type: Sequelize.DECIMAL(15, 2),
      after: "certificate_no"
    });
    await queryInterface.addColumn('sale_products', 'sub_price', {
      type: Sequelize.DECIMAL(15, 3),
      after: "total_weight"
    });
    await queryInterface.addColumn('sale_products', 'rep', {
      type: Sequelize.DECIMAL(15, 2),
      after: "making_charge"
    });
    await queryInterface.addColumn('sale_products', 'tax', {
      type: Sequelize.DECIMAL(15, 2),
      after: "rep"
    });
    await queryInterface.addColumn('sale_products', 'total', {
      type: Sequelize.DECIMAL(15, 2),
      after: "tax"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('sale_products', 'total_weight');
    await queryInterface.removeColumn('sale_products', 'sub_price');
    await queryInterface.removeColumn('sale_products', 'rep');
    await queryInterface.removeColumn('sale_products', 'tax');
    await queryInterface.removeColumn('sale_products', 'total');
  }
};

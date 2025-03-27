'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('purchase_products', 'total_weight', {
      type: Sequelize.DECIMAL(15, 2),
      after: "certificate_no"
    });
    await queryInterface.addColumn('purchase_products', 'sub_price', {
      type: Sequelize.DECIMAL(15, 3),
      after: "total_weight"
    });
    await queryInterface.addColumn('purchase_products', 'making_charge', {
      type: Sequelize.DECIMAL(15, 2),
      after: "sub_price"
    });
    await queryInterface.addColumn('purchase_products', 'rep', {
      type: Sequelize.DECIMAL(15, 2),
      after: "making_charge"
    });
    await queryInterface.addColumn('purchase_products', 'tax', {
      type: Sequelize.DECIMAL(15, 2),
      after: "rep"
    });
    await queryInterface.addColumn('purchase_products', 'total', {
      type: Sequelize.DECIMAL(15, 2),
      after: "tax"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('purchase_products', 'total_weight');
    await queryInterface.removeColumn('purchase_products', 'sub_price');
    await queryInterface.removeColumn('purchase_products', 'making_charge');
    await queryInterface.removeColumn('purchase_products', 'rep');
    await queryInterface.removeColumn('purchase_products', 'tax');
    await queryInterface.removeColumn('purchase_products', 'total');
  }
};

'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('purchase_product_materials', 'purity_id', {
      type: Sequelize.INTEGER,
      after: "quantity"
    });
    await queryInterface.addColumn('purchase_product_materials', 'unit_id', {
      type: Sequelize.INTEGER,
      after: "purity_id"
    });
    await queryInterface.addColumn('purchase_product_materials', 'rate', {
      type: Sequelize.DECIMAL(15, 2),
      after: "unit_id"
    });
    await queryInterface.addColumn('purchase_product_materials', 'amount', {
      type: Sequelize.DECIMAL(15, 2),
      after: "rate"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('purchase_product_materials', 'purity_id');
    await queryInterface.removeColumn('purchase_product_materials', 'unit_id');
    await queryInterface.removeColumn('purchase_product_materials', 'rate');
    await queryInterface.removeColumn('purchase_product_materials', 'amount');
  }
};

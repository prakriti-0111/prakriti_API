'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sale_product_materials', 'purity_id', {
      type: Sequelize.INTEGER,
      after: "quantity"
    });
    await queryInterface.addColumn('sale_product_materials', 'unit_id', {
      type: Sequelize.INTEGER,
      after: "purity_id"
    });
    await queryInterface.addColumn('sale_product_materials', 'rate', {
      type: Sequelize.DECIMAL(15, 2),
      after: "unit_id"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('sale_product_materials', 'purity_id');
    await queryInterface.removeColumn('sale_product_materials', 'unit_id');
    await queryInterface.removeColumn('sale_product_materials', 'rate');
  }
};

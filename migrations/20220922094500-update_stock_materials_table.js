'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('stock_materials', 'purity_id', {
      type: Sequelize.INTEGER,
      after: "quantity"
    });
    await queryInterface.addColumn('stock_materials', 'unit_id', {
      type: Sequelize.INTEGER,
      after: "purity_id"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('stock_materials', 'purity_id');
    await queryInterface.removeColumn('stock_materials', 'unit_id');
  }
};

'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('stock_raw_material_histories', 'purchase_id', {
      type: Sequelize.INTEGER,
      after: "batch_id"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('stock_raw_material_histories', 'purchase_id');
  }
};

'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('purchase_products', 'worker_id', {
      type: Sequelize.INTEGER,
      after: "size_id"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('purchase_products', 'worker_id');
  }
};

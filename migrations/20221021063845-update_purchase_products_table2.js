'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('purchase_products', 'rate', {
      type: Sequelize.DECIMAL(15,2),
      after: "total_weight"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('purchase_products', 'rate');
  }
};

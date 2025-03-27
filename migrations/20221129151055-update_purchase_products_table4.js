'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('purchase_products', 'total_discount', {
      type: Sequelize.DECIMAL(15, 2),
      defaultValue: 0,
      after: "total"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('purchase_products', 'total_discount');
  }
};

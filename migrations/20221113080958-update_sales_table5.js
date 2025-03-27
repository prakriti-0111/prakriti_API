'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sales', 'return_amount', {
      type: Sequelize.DECIMAL(15, 2),
      defaultValue: 0,
      after: "due_amount"
    });
    await queryInterface.addColumn('sales', 'bill_amount', {
      type: Sequelize.DECIMAL(15, 2),
      after: "discount"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('sales', 'return_amount');
   await queryInterface.removeColumn('sales', 'bill_amount');
  }
};

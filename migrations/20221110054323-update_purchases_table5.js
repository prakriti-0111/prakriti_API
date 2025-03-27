'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('purchases', 'return_amount', {
      type: Sequelize.DECIMAL(15, 2),
      defaultValue: 0,
      after: "due_amount"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('purchases', 'return_amount');
  }
};

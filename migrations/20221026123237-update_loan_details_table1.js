'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('loan_details', 'remaining_balance', {
      type: Sequelize.DECIMAL(15, 2),
      after: "amount"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('loan_details', 'remaining_balance');
  }
};

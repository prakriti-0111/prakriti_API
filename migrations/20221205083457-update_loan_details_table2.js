'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('loan_details', 'emi', {
      type: Sequelize.DECIMAL(15, 2),
      after: "interest_amount"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('loan_details', 'emi');
  }
};

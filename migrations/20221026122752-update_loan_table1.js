'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('loans', 'loan_amount', {
      type: Sequelize.DECIMAL(15, 2),
      after: "user_id"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('loans', 'loan_amount');
  }
};

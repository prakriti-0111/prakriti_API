'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('loans', 'interest_amount', {
      type: Sequelize.DECIMAL(15, 2),
      after: "interest"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('loans', 'interest_amount');
  }
};

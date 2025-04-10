'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('loans', 'total_paid', {
      type: Sequelize.DECIMAL(15, 2),
      after: "due_amount"
    });
    await queryInterface.addColumn('loans', 'due_date', {
      type: Sequelize.DATEONLY,
      after: "start_date"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('loans', 'total_paid');
   await queryInterface.removeColumn('loans', 'due_date');
  }
};

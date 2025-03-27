'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('loans', 'interest_display', {
      type: Sequelize.DECIMAL(15, 2),
      after: "interest"
    });
    await queryInterface.addColumn('loans', 'interest_display_type', {
      type: Sequelize.STRING(30),
      after: "interest_display"
    });
    await queryInterface.addColumn('loans', 'notes', {
      type: Sequelize.TEXT,
      after: "start_date"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('loans', 'interest_display');
   await queryInterface.removeColumn('loans', 'interest_display_type');
   await queryInterface.removeColumn('loans', 'notes');
  }
};

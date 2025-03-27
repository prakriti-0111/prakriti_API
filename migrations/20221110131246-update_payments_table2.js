'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('payments', 'purpose', {
      type: Sequelize.STRING,
      after: "type"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('payments', 'purpose');
  }
};

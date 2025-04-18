'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'advance_amount', {
      type: Sequelize.DECIMAL(15, 2),
      defaultValue: 0,
      after: "status"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('users', 'advance_amount');
  }
};

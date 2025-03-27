'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'reset_otp', {
      type: Sequelize.STRING(10),
      after: "documents"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('users', 'reset_otp');
  }
};

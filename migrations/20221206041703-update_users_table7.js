'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'avg_rating', {
      type: Sequelize.DECIMAL(10, 2),
      after: "reset_otp",
      defaultValue: 0
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('users', 'avg_rating');
  }
};

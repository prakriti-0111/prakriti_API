'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('returns', 'return_date', {
      type: Sequelize.DATEONLY,
      after: "declined_at"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('returns', 'return_date');
  }
};

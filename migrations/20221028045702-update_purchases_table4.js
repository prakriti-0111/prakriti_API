'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('purchases', 'req_data', {
      type: Sequelize.TEXT('long'),
      after: "status"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('purchases', 'req_data');
  }
};

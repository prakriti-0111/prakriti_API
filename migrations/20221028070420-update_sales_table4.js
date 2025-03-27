'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sales', 'req_data', {
      type: Sequelize.TEXT('long'),
      after: "total_tag_price"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('sales', 'req_data');
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('purchases', 'bill_amount', {
      type: Sequelize.DECIMAL(15, 2),
      after: "discount"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('purchases', 'bill_amount');
  }
};

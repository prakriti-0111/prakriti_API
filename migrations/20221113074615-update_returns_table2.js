'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('returns', 'product_amount', {
      type: Sequelize.DECIMAL(15, 2),
      after: "cheque_no",
    });
    await queryInterface.addColumn('returns', 'charge', {
      type: Sequelize.DECIMAL(15, 2),
      after: "product_amount"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('returns', 'product_amount');
   await queryInterface.removeColumn('returns', 'charge');
  }
};

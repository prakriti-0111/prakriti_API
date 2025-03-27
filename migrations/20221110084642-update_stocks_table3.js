'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('stocks', 'purchase_product_id', {
      type: Sequelize.INTEGER,
      after: "purchase_id"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('stocks', 'purchase_product_id');
  }
};

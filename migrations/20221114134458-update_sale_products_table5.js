'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sale_products', 'is_return', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      after: "total"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('sale_products', 'is_return');
  }
};

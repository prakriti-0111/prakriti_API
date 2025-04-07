'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'weight', {
      type: Sequelize.DECIMAL(15, 3),
      after: "licence_no"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('products', 'weight');
  }
};

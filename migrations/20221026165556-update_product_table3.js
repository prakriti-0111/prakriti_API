'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'short_desc', {
      type: Sequelize.TEXT,
      after: "description"
    });
    await queryInterface.addColumn('products', 'keywords', {
      type: Sequelize.TEXT,
      after: "status"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('products', 'short_desc');
   await queryInterface.removeColumn('products', 'keywords');
  }
};

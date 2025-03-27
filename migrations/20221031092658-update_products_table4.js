'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'meta_title', {
      type: Sequelize.STRING,
      after: "short_desc"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('products', 'meta_title');
  }
};

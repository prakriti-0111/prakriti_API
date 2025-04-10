'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('categories', 'is_material', {
      type: Sequelize.BOOLEAN,
      after: "slug",
      defaultValue: false
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('categories', 'is_material');
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sizes', 'category_id', {
      type: Sequelize.INTEGER,
      after: "id"
    });
    await queryInterface.addColumn('sizes', 'sub_category_id', {
      type: Sequelize.INTEGER,
      after: "category_id"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('sizes', 'category_id');
   await queryInterface.removeColumn('sizes', 'sub_category_id');
  }
};

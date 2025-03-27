'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('returns', 'parent_id', {
      type: Sequelize.INTEGER,
      after: "id",
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('returns', 'parent_id');
  }
};

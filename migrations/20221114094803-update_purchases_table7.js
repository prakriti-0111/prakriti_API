'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('purchases', 'sale_id', {
      type: Sequelize.INTEGER,
      after: "user_id"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('purchases', 'sale_id');
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('purchases', 'user_id', {
      type: Sequelize.INTEGER,
      after: "supplier_id"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('purchases', 'user_id');
  }
};

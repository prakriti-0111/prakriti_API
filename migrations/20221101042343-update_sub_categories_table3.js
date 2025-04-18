'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sub_categories', 'base_price', {
      type: Sequelize.DECIMAL(15, 2),
      after: "making_charge_type"
    });

    await queryInterface.addColumn('sub_categories', 'increase', {
      type: Sequelize.DECIMAL(15, 2),
      after: "base_price"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('sub_categories', 'base_price');
   await queryInterface.removeColumn('sub_categories', 'increase');
  }
};

'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'certified', {
      type: Sequelize.BOOLEAN,
      after: "status"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'certified');
  }
};

'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sales', 'sale_by', {
      type: Sequelize.INTEGER,
      after: "user_id"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('sales', 'sale_by');
  }
};

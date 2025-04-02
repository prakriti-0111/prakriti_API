'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('stocks', 'sale_id', {
      type: Sequelize.INTEGER,
      after: "purchase_id"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('stocks', 'sale_id');
  }
};

'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('stocks', 'user_id', {
      type: Sequelize.INTEGER,
      after: "purchase_id"
    });
    await queryInterface.addColumn('stocks', 'quantity', {
      type: Sequelize.INTEGER,
      after: "certificate_no"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('stocks', 'user_id');
    await queryInterface.removeColumn('stocks', 'quantity');
  }
};

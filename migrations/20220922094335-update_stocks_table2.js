'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('stocks', 'total_weight', {
      type: Sequelize.DECIMAL(15, 3),
      after: "quantity"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('stocks', 'total_weight');
  }
};

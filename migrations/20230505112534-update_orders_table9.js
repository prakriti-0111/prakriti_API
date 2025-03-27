'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('orders', 'old_sub_total', {
      type: Sequelize.DECIMAL(15, 2),
      after: "image"
    });
    await queryInterface.addColumn('orders', 'old_discount_amount', {
      type: Sequelize.DECIMAL(15, 2),
      after: "old_sub_total"
    });
    await queryInterface.addColumn('orders', 'old_total_amount', {
      type: Sequelize.DECIMAL(15, 2),
      after: "old_discount_amount"
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('orders', 'old_sub_total');
    await queryInterface.removeColumn('orders', 'old_discount_amount');
    await queryInterface.removeColumn('orders', 'old_total_amount');
  }
};

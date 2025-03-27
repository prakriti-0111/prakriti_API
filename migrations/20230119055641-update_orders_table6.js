'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('orders', 'expected_delivery_date', {
      type: Sequelize.DATEONLY,
      after: "order_by"
    });
    await queryInterface.addColumn('orders', 'on_process_at', {
      type: Sequelize.DATE,
      after: "expected_delivery_date"
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('orders', 'expected_delivery_date');
    await queryInterface.removeColumn('orders', 'on_process_at');
  }
};

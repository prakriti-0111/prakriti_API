'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('orders', 'accepted_at', {
      type: Sequelize.DATE,
      after: "status"
    });
    await queryInterface.addColumn('orders', 'shipped_at', {
      type: Sequelize.DATE,
      after: "accepted_at"
    });
    await queryInterface.addColumn('orders', 'out_for_delivery_at', {
      type: Sequelize.DATE,
      after: "shipped_at"
    });
    await queryInterface.addColumn('orders', 'delivered_at', {
      type: Sequelize.DATE,
      after: "out_for_delivery_at"
    });
    await queryInterface.addColumn('orders', 'cancelled_at', {
      type: Sequelize.DATE,
      after: "delivered_at"
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.removeColumn('orders', 'accepted_at');
     await queryInterface.removeColumn('orders', 'shipped_at');
     await queryInterface.removeColumn('orders', 'out_for_delivery_at');
     await queryInterface.removeColumn('orders', 'delivered_at');
     await queryInterface.removeColumn('orders', 'cancelled_at');
  }
};

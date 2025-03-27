'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('orders', 'promocode_id', {
      type: Sequelize.INTEGER,
      after: "discount_amount"
    });
    await queryInterface.addColumn('orders', 'promocode', {
      type: Sequelize.STRING(30),
      after: "promocode_id"
    });
    await queryInterface.addColumn('orders', 'promocode_discount', {
      type: Sequelize.DECIMAL(15, 2),
      after: "promocode"
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.removeColumn('orders', 'promocode_id');
     await queryInterface.removeColumn('orders', 'promocode');
     await queryInterface.removeColumn('orders', 'promocode_discount');
  }
};

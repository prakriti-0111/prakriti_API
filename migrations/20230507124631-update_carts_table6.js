'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('carts', 'order_id', {
      type: Sequelize.INTEGER,
      after: "is_manual"
    });
    await queryInterface.addColumn('carts', 'order_product_id', {
      type: Sequelize.INTEGER,
      after: "order_id"
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('carts', 'order_id');
    await queryInterface.removeColumn('carts', 'order_product_id');
  }
};

'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('stock_raw_material_histories', 'purity_id', {
      type: Sequelize.INTEGER,
      after: "quantity"
    });
    await queryInterface.addColumn('stock_raw_material_histories', 'status', {
      type: Sequelize.STRING(30),
      after: "type"
    });
    await queryInterface.addColumn('stock_raw_material_histories', 'parent_id', {
      type: Sequelize.INTEGER,
      after: "id"
    });
    await queryInterface.addColumn('stock_raw_material_histories', 'can_accept', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      after: "status"
    });
    await queryInterface.addColumn('stock_raw_material_histories', 'reason', {
      type: Sequelize.TEXT,
      after: "can_accept"
    });
    await queryInterface.addColumn('stock_raw_material_histories', 'order_id', {
      type: Sequelize.INTEGER,
      after: "id"
    });
    await queryInterface.addColumn('stock_raw_material_histories', 'order_product_id', {
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
    await queryInterface.removeColumn('stock_raw_material_histories', 'purity_id');
    await queryInterface.removeColumn('stock_raw_material_histories', 'status');
    await queryInterface.removeColumn('stock_raw_material_histories', 'parent_id');
    await queryInterface.removeColumn('stock_raw_material_histories', 'can_accept');
    await queryInterface.removeColumn('stock_raw_material_histories', 'reason');
    await queryInterface.removeColumn('stock_raw_material_histories', 'order_id');
    await queryInterface.removeColumn('stock_raw_material_histories', 'order_product_id');
  }
};

'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('order_materials', 'old_purity_id', {
      type: Sequelize.INTEGER,
      after: "return_weight"
    });
    await queryInterface.addColumn('order_materials', 'old_weight', {
      type: Sequelize.DECIMAL(15, 3),
      after: "old_purity_id"
    });
    await queryInterface.addColumn('order_materials', 'old_quantity', {
      type: Sequelize.INTEGER,
      after: "old_weight"
    });
    await queryInterface.addColumn('order_materials', 'old_price', {
      type: Sequelize.DECIMAL(15, 2),
      after: "old_quantity"
    });
    await queryInterface.addColumn('order_materials', 'old_discount', {
      type: Sequelize.DECIMAL(15, 2),
      after: "old_price"
    });
    await queryInterface.addColumn('order_materials', 'old_discount_type', {
      type: Sequelize.STRING(30),
      after: "old_discount"
    });
    await queryInterface.addColumn('order_materials', 'old_total', {
      type: Sequelize.DECIMAL(15, 2),
      after: "old_discount_type"
    });
    await queryInterface.addColumn('order_materials', 'old_per_gram_price', {
      type: Sequelize.DECIMAL(15, 2),
      after: "old_total"
    });
    await queryInterface.addColumn('order_materials', 'old_discount_percent', {
      type: Sequelize.DECIMAL(15, 2),
      after: "old_per_gram_price"
    });
    await queryInterface.addColumn('order_materials', 'old_total_gram', {
      type: Sequelize.DECIMAL(15, 3),
      after: "old_discount_percent"
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('order_materials', 'old_purity_id');
    await queryInterface.removeColumn('order_materials', 'old_weight');
    await queryInterface.removeColumn('order_materials', 'old_quantity');
    await queryInterface.removeColumn('order_materials', 'old_price');
    await queryInterface.removeColumn('order_materials', 'old_discount');
    await queryInterface.removeColumn('order_materials', 'old_discount_type');
    await queryInterface.removeColumn('order_materials', 'old_total');
    await queryInterface.removeColumn('order_materials', 'old_per_gram_price');
    await queryInterface.removeColumn('order_materials', 'old_discount_percent');
    await queryInterface.removeColumn('order_materials', 'old_total_gram');
  }
};

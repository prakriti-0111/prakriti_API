'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('order_materials', 'return_qty', {
      type: Sequelize.INTEGER,
      after: "per_gram_price",
      defaultValue: 0
    });
    await queryInterface.addColumn('order_materials', 'return_weight', {
      type: Sequelize.DECIMAL(15, 3),
      after: "return_qty",
      defaultValue: 0
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('order_materials', 'return_qty');
    await queryInterface.removeColumn('order_materials', 'return_weight');
  }
};

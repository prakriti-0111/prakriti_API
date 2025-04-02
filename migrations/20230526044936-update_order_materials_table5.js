'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('order_materials', 'sent_weight', {
      type: Sequelize.DECIMAL(15, 3),
      after: "weight"
    });
    await queryInterface.addColumn('order_materials', 'sent_quantity', {
      type: Sequelize.INTEGER,
      after: "quantity"
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('order_materials', 'sent_weight');
    await queryInterface.removeColumn('order_materials', 'sent_quantity');
  }
};

'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('stocks', 'type', {
      type: Sequelize.STRING(30),
      after: "total_weight",
      defaultValue: "product"
    });

    await queryInterface.addColumn('stocks', 'material_id', {
      type: Sequelize.INTEGER,
      after: "product_id"
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('stocks', 'type');
    await queryInterface.removeColumn('stocks', 'material_id');
  }
};

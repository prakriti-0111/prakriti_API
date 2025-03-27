'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('stock_raw_material_histories', 'belongs_to', {
      type: Sequelize.INTEGER,
      after: "id"
    });
    await queryInterface.addColumn('stock_raw_material_histories', 'outstanding_weight', {
      type: Sequelize.DECIMAL(15, 3),
      after: "type",
      defaultValue: 0
    });
    await queryInterface.addColumn('stock_raw_material_histories', 'outstanding_qty', {
      type: Sequelize.INTEGER,
      after: "outstanding_weight",
      defaultValue: 0
    });
    await queryInterface.addColumn('stock_raw_material_histories', 'outstanding_gram', {
      type: Sequelize.DECIMAL(15, 3),
      after: "outstanding_qty",
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
    await queryInterface.removeColumn('stock_raw_material_histories', 'belongs_to');
    await queryInterface.removeColumn('stock_raw_material_histories', 'outstanding_weight');
    await queryInterface.removeColumn('stock_raw_material_histories', 'outstanding_qty');
    await queryInterface.removeColumn('stock_raw_material_histories', 'outstanding_gram');
  }
};

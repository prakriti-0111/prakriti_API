'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('carts', 'promocode_id', {
      type: Sequelize.INTEGER,
      after: "total_weight"
    });
    await queryInterface.addColumn('carts', 'promocode', {
      type: Sequelize.STRING(30),
      after: "promocode_id"
    });
    await queryInterface.addColumn('carts', 'promocode_discount', {
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
     await queryInterface.removeColumn('carts', 'promocode_id');
     await queryInterface.removeColumn('carts', 'promocode');
     await queryInterface.removeColumn('carts', 'promocode_discount');
  }
};

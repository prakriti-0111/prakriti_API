'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('orders', 'notes', {
      type: Sequelize.TEXT,
      after: "on_process_at"
    });
    await queryInterface.addColumn('orders', 'image', {
      type: Sequelize.STRING(100),
      after: "notes"
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('orders', 'notes');
    await queryInterface.removeColumn('orders', 'image');
  }
};

'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('sales', 'accept_declined_at', {
      type: Sequelize.DATE,
      after: "is_assigned"
    });
    await queryInterface.addColumn('sales', 'image', {
      type: Sequelize.STRING,
      after: "accept_declined_at"
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.removeColumn('sales', 'accept_declined_at');
     await queryInterface.removeColumn('sales', 'image');
  }
};

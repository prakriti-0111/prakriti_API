'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('expenses', 'created_by', {
      type: Sequelize.INTEGER,
      after: "user_id"
    });
    await queryInterface.addColumn('expenses', 'status', {
      type: Sequelize.STRING(30),
      after: "explanation",
      defaultValue: "approved"
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.removeColumn('expenses', 'created_by');
     await queryInterface.removeColumn('expenses', 'status');
  }
};

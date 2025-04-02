'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('users', 'own', {
      type: Sequelize.BOOLEAN,
      after: "weekly_holidays",
      defaultValue: false
    });
    await queryInterface.addColumn('users', 'expense', {
      type: Sequelize.BOOLEAN,
      after: "own",
      defaultValue: false
    });
    await queryInterface.addColumn('users', 'expense_action', {
      type: Sequelize.BOOLEAN,
      after: "expense",
      defaultValue: false
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('users', 'own');
    await queryInterface.removeColumn('users', 'expense');
    await queryInterface.removeColumn('users', 'expense_action');
  }
};

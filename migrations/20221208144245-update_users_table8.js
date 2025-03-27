'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('users', 'dob', {
      type: Sequelize.DATEONLY,
      after: "avg_rating"
    });
    await queryInterface.addColumn('users', 'marital_status', {
      type: Sequelize.STRING(30),
      after: "dob"
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.removeColumn('users', 'dob');
     await queryInterface.removeColumn('users', 'marital_status');
  }
};

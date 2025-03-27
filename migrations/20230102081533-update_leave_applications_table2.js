'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('leave_applications', 'from_date', {
      type: Sequelize.DATEONLY,
      after: "explanation"
    });
    await queryInterface.addColumn('leave_applications', 'to_date', {
      type: Sequelize.DATEONLY,
      after: "from_date"
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('leave_applications', 'from_date');
    await queryInterface.removeColumn('leave_applications', 'to_date');
  }
};

'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('returns', 'to_user_id', {
      type: Sequelize.INTEGER,
      after: "user_id"
    });
    await queryInterface.addColumn('returns', 'sales_executive_id', {
      type: Sequelize.INTEGER,
      after: "to_user_id"
    });
    await queryInterface.addColumn('returns', 'picked_up_at', {
      type: Sequelize.DATE,
      after: "return_date"
    });
    await queryInterface.addColumn('returns', 'cancelled_at', {
      type: Sequelize.DATE,
      after: "picked_up_at"
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.removeColumn('returns', 'to_user_id');
     await queryInterface.removeColumn('returns', 'sales_executive_id');
     await queryInterface.removeColumn('returns', 'picked_up_at');
     await queryInterface.removeColumn('returns', 'cancelled_at');
  }
};

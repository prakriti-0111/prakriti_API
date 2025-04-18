'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('salaries', 'incentive', {
      type: Sequelize.DECIMAL(15, 2),
      after: "salary_date",
      defaultValue: 0
    });
    await queryInterface.addColumn('salaries', 'incentive_percent', {
      type: Sequelize.DECIMAL(10, 2),
      after: "incentive",
      defaultValue: 0
    });
    await queryInterface.addColumn('salaries', 'incentive_on', {
      type: Sequelize.DECIMAL(10, 2),
      after: "incentive_percent",
      defaultValue: 0
    });
    await queryInterface.addColumn('salaries', 'type', {
      type: Sequelize.STRING(30),
      after: "user_id",
      defaultValue: 'salary'
    });
    await queryInterface.addColumn('salaries', 'paid_amount', {
      type: Sequelize.DECIMAL(15, 2),
      after: "incentive",
      defaultValue: 0
    });
    await queryInterface.addColumn('salaries', 'payment_mode', {
      type: Sequelize.STRING(30),
      after: "paid_amount"
    });
    await queryInterface.addColumn('salaries', 'txn_id', {
      type: Sequelize.STRING(50),
      after: "payment_mode"
    });
    await queryInterface.addColumn('salaries', 'cheque_no', {
      type: Sequelize.STRING(50),
      after: "txn_id"
    });
    await queryInterface.addColumn('salaries', 'balance', {
      type: Sequelize.DECIMAL(15, 2),
      after: "cheque_no"
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('salaries', 'incentive');
    await queryInterface.removeColumn('salaries', 'type');
    await queryInterface.removeColumn('salaries', 'paid_amount');
    await queryInterface.removeColumn('salaries', 'payment_mode');
    await queryInterface.removeColumn('salaries', 'txn_id');
    await queryInterface.removeColumn('salaries', 'cheque_no');
    await queryInterface.removeColumn('salaries', 'balance');
  }
};

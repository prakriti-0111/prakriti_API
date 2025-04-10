'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sales', 'taxable_amount', {
      type: Sequelize.DECIMAL(15, 2),
      after: "transaction_no"
    });
    await queryInterface.addColumn('sales', 'total_payable', {
      type: Sequelize.DECIMAL(15, 2),
      after: "discount"
    });
    await queryInterface.addColumn('sales', 'paid_amount', {
      type: Sequelize.DECIMAL(15, 2),
      after: "total_payable"
    });
    await queryInterface.addColumn('sales', 'due_amount', {
      type: Sequelize.DECIMAL(15, 2),
      after: "paid_amount"
    });
    await queryInterface.addColumn('sales', 'due_date', {
      type: Sequelize.DATEONLY,
      after: "due_amount"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('sales', 'taxable_amount');
    await queryInterface.removeColumn('sales', 'total_payable');
    await queryInterface.removeColumn('sales', 'paid_amount');
    await queryInterface.removeColumn('sales', 'due_amount');
    await queryInterface.removeColumn('sales', 'due_date');
  }
};

'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('purchases', 'taxable_amount', {
      type: Sequelize.DECIMAL(15, 2),
      after: "transaction_no"
    });
    await queryInterface.addColumn('purchases', 'total_payable', {
      type: Sequelize.DECIMAL(15, 2),
      after: "discount"
    });
    await queryInterface.addColumn('purchases', 'due_amount', {
      type: Sequelize.DECIMAL(15, 2),
      after: "paid_amount"
    });
    await queryInterface.addColumn('purchases', 'due_date', {
      type: Sequelize.DATEONLY,
      after: "due_amount"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('purchases', 'taxable_amount');
    await queryInterface.removeColumn('purchases', 'total_payable');
    await queryInterface.removeColumn('purchases', 'due_amount');
    await queryInterface.removeColumn('purchases', 'due_date');
  }
};

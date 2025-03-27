'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn('payments', 'remaining_balance', {
      type: Sequelize.DECIMAL(15, 2),
      after: "type"
    });
    await queryInterface.addColumn('payments', 'payment_belongs', {
      type: Sequelize.INTEGER,
      after: "remaining_balance"
    });
    await queryInterface.addColumn('payments', 'ref_no', {
      type: Sequelize.STRING(100),
      after: "payment_belongs"
    });
    await queryInterface.addColumn('payments', 'reasons', {
      type: Sequelize.TEXT,
      after: "ref_no"
    });
    await queryInterface.addColumn('payments', 'due_date', {
      type: Sequelize.DATEONLY,
      after: "reasons"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('payments', 'remaining_balance');
    await queryInterface.removeColumn('payments', 'ref_no');
    await queryInterface.removeColumn('payments', 'reasons');
    await queryInterface.removeColumn('payments', 'payment_belongs');
    await queryInterface.removeColumn('payments', 'due_date');
  }
};

'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sales', 'settlement_date', {
      type: Sequelize.DATEONLY,
      after: "due_date"
    });
    await queryInterface.renameColumn('sales', 'tax', 'cgst_tax');
    await queryInterface.addColumn('sales', 'sgst_tax', {
      type: Sequelize.DECIMAL(15, 2),
      after: "cgst_tax"
    });
    await queryInterface.addColumn('sales', 'igst_tax', {
      type: Sequelize.DECIMAL(15, 2),
      after: "sgst_tax"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('sales', 'settlement_date');
    await queryInterface.renameColumn('sales', 'cgst_tax', 'tax');
    await queryInterface.removeColumn('sales', 'sgst_tax');
    await queryInterface.removeColumn('sales', 'igst_tax');
  }
};

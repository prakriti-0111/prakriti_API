'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('sale_products', 'cgst_tax', {
      type: Sequelize.DECIMAL(15, 2),
      after: "tax",
      defaultValue: 0
    });
    await queryInterface.addColumn('sale_products', 'sgst_tax', {
      type: Sequelize.DECIMAL(15, 2),
      after: "cgst_tax",
      defaultValue: 0
    });
    await queryInterface.addColumn('sale_products', 'igst_tax', {
      type: Sequelize.DECIMAL(15, 2),
      after: "sgst_tax",
      defaultValue: 0
    });
    await queryInterface.addColumn('sale_products', 'tax_info', {
      type: Sequelize.TEXT,
      after: "igst_tax",
      defaultValue: 0
    });
    await queryInterface.addColumn('sale_products', 'making_charge_discount_percent', {
      type: Sequelize.DECIMAL(15, 2),
      after: "tax_info",
      defaultValue: 0
    });
    await queryInterface.addColumn('sale_products', 'max_making_charge_discount_percent', {
      type: Sequelize.DECIMAL(15, 2),
      after: "making_charge_discount_percent",
      defaultValue: 0
    });
    await queryInterface.addColumn('sale_products', 'sub_cat_making_charge', {
      type: Sequelize.DECIMAL(15, 2),
      after: "max_making_charge_discount_percent",
      defaultValue: 0
    });
    await queryInterface.addColumn('sale_products', 'sub_cat_making_charge_type', {
      type: Sequelize.STRING(30),
      after: "sub_cat_making_charge"
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('sale_products', 'cgst_tax');
    await queryInterface.removeColumn('sale_products', 'sgst_tax');
    await queryInterface.removeColumn('sale_products', 'igst_tax');
    await queryInterface.removeColumn('sale_products', 'tax_info');
    await queryInterface.removeColumn('sale_products', 'making_charge_discount_percent');
    await queryInterface.removeColumn('sale_products', 'max_making_charge_discount_percent');
    await queryInterface.removeColumn('sale_products', 'sub_cat_making_charge');
    await queryInterface.removeColumn('sale_products', 'sub_cat_making_charge_type');
  }
};

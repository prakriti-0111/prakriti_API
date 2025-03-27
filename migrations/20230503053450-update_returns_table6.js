'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('returns', 'from_retailer_customer', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      after: "req_data"
    });
    await queryInterface.addColumn('returns', 'show_superadmin', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      after: "from_retailer_customer"
    });
    await queryInterface.addColumn('returns', 'return_amount_from_wallet', {
      type: Sequelize.DECIMAL(15, 2),
      defaultValue: 0,
      after: "show_superadmin"
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.removeColumn('returns', 'from_retailer_customer');
     await queryInterface.removeColumn('returns', 'show_superadmin');
     await queryInterface.removeColumn('returns', 'return_amount_from_wallet');
  }
};

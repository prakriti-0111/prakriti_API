'use strict';

/* Whether an admin's stock is listed on the customer frontend. Defaults to
   true so every existing admin's stock keeps showing until it is turned off. */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'show_frontend_stock', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      after: 'expense_action',
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('users', 'show_frontend_stock');
  }
};

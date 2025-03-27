'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('purchase_product_materials', 'discount_amount', {
      type: Sequelize.DECIMAL(15, 2),
      defaultValue: 0,
      after: "amount"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('purchase_product_materials', 'discount_amount');
  }
};

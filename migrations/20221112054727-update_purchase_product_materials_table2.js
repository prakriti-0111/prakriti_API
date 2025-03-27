'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('purchase_product_materials', 'return_qty', {
      type: Sequelize.INTEGER,
      after: "amount",
      defaultValue: 0
    });
    await queryInterface.addColumn('purchase_product_materials', 'return_weight', {
      type: Sequelize.DECIMAL(15, 3),
      after: "return_qty",
      defaultValue: 0
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('purchase_product_materials', 'return_qty');
   await queryInterface.removeColumn('purchase_product_materials', 'return_weight');
  }
};

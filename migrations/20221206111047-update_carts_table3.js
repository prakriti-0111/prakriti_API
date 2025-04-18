'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('carts', 'certificate_no', {
      type: Sequelize.STRING,
      after: "stock_id"
    });
    await queryInterface.addColumn('carts', 'sale_product_id', {
      type: Sequelize.INTEGER,
      after: "stock_id"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('carts', 'certificate_no');
   await queryInterface.removeColumn('carts', 'sale_product_id');
  }
};

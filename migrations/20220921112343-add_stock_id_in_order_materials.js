'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('order_materials', 'stock_id', {
      type: Sequelize.INTEGER,
      after: "size_id"
    });
    await queryInterface.addColumn('order_materials', 'purity_id', {
      type: Sequelize.INTEGER,
      after: "stock_id"
    });
    await queryInterface.removeColumn('order_materials', 'purchase_id');
    await queryInterface.removeColumn('order_materials', 'sale_id');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('order_materials', 'stock_id');
    await queryInterface.removeColumn('carts', 'stock_id');
    await queryInterface.removeColumn('carts', 'purity_id');
  }
};

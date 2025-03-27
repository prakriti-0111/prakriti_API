'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('carts', 'stock_id', {
      type: Sequelize.INTEGER,
      after: "user_id"
    });
    await queryInterface.addColumn('carts', 'discount', {
      type: Sequelize.DECIMAL(15, 2),
      after: "stock_id"
    });
    await queryInterface.addColumn('carts', 'discount_type', {
      type: Sequelize.STRING(20),
      after: "discount"
    });
    await queryInterface.addColumn('carts', 'rate', {
      type: Sequelize.DECIMAL(15, 2),
      after: "discount_type"
    });
    await queryInterface.removeColumn('carts', 'purchase_id');
    await queryInterface.removeColumn('carts', 'sale_id');
    await queryInterface.removeColumn('carts', 'certificate_no');
  },
  
  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('carts', 'stock_id');
    queryInterface.removeColumn('carts', 'discount');
    queryInterface.removeColumn('carts', 'discount_type');
    queryInterface.removeColumn('carts', 'rate');
  }
};

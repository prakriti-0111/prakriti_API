'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sale_product_materials', 'discount_amount', {
      type: Sequelize.DECIMAL(15,2),
      after: "amount"
    });
    await queryInterface.addColumn('sale_product_materials', 'discount_percent', {
      type: Sequelize.DECIMAL(15,2),
      after: "discount_amount"
    });
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('sale_product_materials', 'discount_amount');
  await queryInterface.removeColumn('sale_product_materials', 'discount_percent');
}
};

'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('order_materials', 'order_product_id', {
      type: Sequelize.INTEGER,
      after: "order_id"
    });
    await queryInterface.addColumn('order_materials', 'unit_id', {
      type: Sequelize.INTEGER,
      after: "purity_id"
    });
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('order_materials', 'order_product_id');
  await queryInterface.removeColumn('order_materials', 'unit_id');
}
};

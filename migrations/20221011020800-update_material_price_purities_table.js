'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('material_price_purities', 'mrp', {
      type: Sequelize.DECIMAL(15,2),
      after: "customer_discount"
    });
    await queryInterface.addColumn('material_price_purities', 'admin_price', {
      type: Sequelize.DECIMAL(15,2),
      after: "mrp"
    });
    await queryInterface.addColumn('material_price_purities', 'distributor_price', {
      type: Sequelize.DECIMAL(15,2),
      after: "admin_price"
    });
    await queryInterface.addColumn('material_price_purities', 'se_price', {
      type: Sequelize.DECIMAL(15,2),
      after: "distributor_price"
    });
    await queryInterface.addColumn('material_price_purities', 'retailer_max_price', {
      type: Sequelize.DECIMAL(15,2),
      after: "se_price"
    });
    await queryInterface.addColumn('material_price_purities', 'customer_price', {
      type: Sequelize.DECIMAL(15,2),
      after: "retailer_max_price"
    });
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('material_price_purities', 'mrp');
  await queryInterface.removeColumn('material_price_purities', 'admin_price');
  await queryInterface.removeColumn('material_price_purities', 'distributor_price');
  await queryInterface.removeColumn('material_price_purities', 'se_price');
  await queryInterface.removeColumn('material_price_purities', 'retailer_max_price');
  await queryInterface.removeColumn('material_price_purities', 'customer_price');
}
};

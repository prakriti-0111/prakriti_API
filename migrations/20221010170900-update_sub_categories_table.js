'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sub_categories', 'admin_discount', {
      type: Sequelize.DECIMAL(15,2),
      after: "making_charge"
    });
    await queryInterface.addColumn('sub_categories', 'distributor_discount', {
      type: Sequelize.DECIMAL(15,2),
      after: "admin_discount"
    });
    await queryInterface.addColumn('sub_categories', 'retailer_discount', {
      type: Sequelize.DECIMAL(15,2),
      after: "distributor_discount"
    });
    await queryInterface.addColumn('sub_categories', 'customer_discount', {
      type: Sequelize.DECIMAL(15,2),
      after: "retailer_discount"
    });
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('sub_categories', 'admin_discount');
  await queryInterface.removeColumn('sub_categories', 'distributor_discount');
  await queryInterface.removeColumn('sub_categories', 'retailer_discount');
  await queryInterface.removeColumn('sub_categories', 'customer_discount');
}
};

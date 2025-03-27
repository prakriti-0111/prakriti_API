'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('material_price_purities', 'increase', {
      type: Sequelize.DECIMAL(15,2),
      after: "customer_discount"
    });
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('material_price_purities', 'increase');
}
};

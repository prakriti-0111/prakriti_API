'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('material_price_purities', 'per_gram_price', {
      type: Sequelize.DECIMAL(10, 2),
      after: "price"
    });
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('material_price_purities', 'per_gram_price');
}
};

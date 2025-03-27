'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('carts', 'total_weight', {
      type: Sequelize.DECIMAL(15, 3),
      after: "quantity"
    });
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('carts', 'total_weight');
}
};

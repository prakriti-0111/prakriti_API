'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('cart_materials', 'unit_id', {
      type: Sequelize.INTEGER,
      after: "weight"
    });
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('cart_materials', 'unit_id');
}
};

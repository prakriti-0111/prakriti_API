'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('cart_materials', 'purity_id', {
      type: Sequelize.INTEGER,
      after: "material_id"
    });
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('cart_materials', 'purity_id');
}
};

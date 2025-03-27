'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('stock_materials', 'weight_in_gram', {
      type: Sequelize.DECIMAL(15,3),
      after: "weight"
    });
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('stock_materials', 'weight_in_gram');
}
};

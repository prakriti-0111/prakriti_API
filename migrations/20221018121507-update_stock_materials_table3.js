'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('stock_materials', 'category_id', {
      type: Sequelize.INTEGER,
      after: "stock_id"
    });
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('stock_materials', 'category_id');
}
};

'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'slug', {
      type: Sequelize.STRING,
      after: "name"
    });
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('products', 'slug');
}
};

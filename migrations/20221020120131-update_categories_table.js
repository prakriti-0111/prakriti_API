'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('categories', 'banner', {
      type: Sequelize.STRING,
      after: "status"
    });
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('categories', 'banner');
}
};

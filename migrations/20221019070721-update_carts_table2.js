'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('carts', 'type', {
      type: Sequelize.STRING(30),
      after: "id"
    });
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('carts', 'type');
}
};

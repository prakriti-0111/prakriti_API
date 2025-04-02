'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('wishlists', 'user_id', {
      type: Sequelize.INTEGER,
      after: "id"
    });
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('wishlists', 'user_id');
}
};

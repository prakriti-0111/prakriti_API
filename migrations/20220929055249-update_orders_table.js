'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('orders', 'to_user_id', {
      type: Sequelize.INTEGER,
      after: "user_id"
    });
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('orders', 'to_user_id');
}
};

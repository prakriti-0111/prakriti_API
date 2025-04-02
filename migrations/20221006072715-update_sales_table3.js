'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('sales', 'order_id', {
      type: Sequelize.INTEGER,
      after: "user_id"
    });
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('sales', 'order_id');
}
};

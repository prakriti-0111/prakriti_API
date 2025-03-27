'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('purchases', 'status', {
      type: Sequelize.STRING(30),
      after: "due_date",
      defaultValue: 'due'
    });
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('purchases', 'status');
}
};

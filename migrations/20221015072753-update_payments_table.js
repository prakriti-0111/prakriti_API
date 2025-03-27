'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('payments', 'table_type', {
      type: Sequelize.STRING(100),
      after: "payment_by"
    });
    await queryInterface.addColumn('payments', 'table_id', {
      type: Sequelize.INTEGER,
      after: "table_type"
    });
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('payments', 'table_type');
  await queryInterface.removeColumn('payments', 'table_id');
}
};

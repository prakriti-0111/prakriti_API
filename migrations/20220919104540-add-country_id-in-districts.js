'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('districts', 'country_id', {
      type: Sequelize.INTEGER,
      after: "id"
    });
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('districts', 'country_id');
}
};

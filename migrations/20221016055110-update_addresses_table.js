'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('addresses', 'country_id', {
      type: Sequelize.INTEGER,
      after: "lng"
    });
    await queryInterface.addColumn('addresses', 'state_id', {
      type: Sequelize.INTEGER,
      after: "country_id"
    });
    await queryInterface.addColumn('addresses', 'district_id', {
      type: Sequelize.INTEGER,
      after: "state_id"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('addresses', 'country_id');
    await queryInterface.removeColumn('addresses', 'state_id');
    await queryInterface.removeColumn('addresses', 'district_id');
  }
};

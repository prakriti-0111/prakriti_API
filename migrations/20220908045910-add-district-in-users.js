'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'district_id', {
      type: Sequelize.INTEGER,
      after: "state_id"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'district_id');
  }
};

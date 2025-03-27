'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.addColumn('users', 'parent_id', {
        type: Sequelize.INTEGER,
        after: "role_id"
      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'parent_id');
  }
};

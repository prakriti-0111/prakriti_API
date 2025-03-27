'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('payments', 'can_accept', {
      type: Sequelize.BOOLEAN,
      after: "due_date",
      defaultValue: true
    });

    await queryInterface.addColumn('payments', 'parent_id', {
      type: Sequelize.INTEGER,
      after: "id"
    });

    await queryInterface.addColumn('payments', 'is_advance', {
      type: Sequelize.BOOLEAN,
      after: "can_accept",
      defaultValue: false
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('payments', 'can_accept');
   await queryInterface.removeColumn('payments', 'parent_id');
   await queryInterface.removeColumn('payments', 'is_advance');
  }
};

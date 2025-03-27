'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'parents_name', {
      type: Sequelize.STRING,
      after: "bank_ifsc"
    });
    await queryInterface.addColumn('users', 'parents_contact_no', {
      type: Sequelize.STRING,
      after: "parents_name"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('users', 'parents_name');
   await queryInterface.removeColumn('users', 'parents_contact_no');
  }
};

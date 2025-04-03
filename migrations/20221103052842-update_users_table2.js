'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'documents', {
      type: Sequelize.TEXT,
      after: "address_proof_image"
    });
    await queryInterface.addColumn('users', 'user_name', {
      type: Sequelize.STRING,
      after: "email"
    });
    await queryInterface.addColumn('users', 'landmark', {
      type: Sequelize.STRING,
      after: "city"
    });
    await queryInterface.addColumn('users', 'blood_group', {
      type: Sequelize.STRING(30),
      after: "landmark"
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('users', 'is_material');
   await queryInterface.removeColumn('users', 'user_name');
   await queryInterface.removeColumn('users', 'landmark');
   await queryInterface.removeColumn('users', 'blood_group');
  }
};

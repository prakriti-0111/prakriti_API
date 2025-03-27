'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('certificates', 'certificate_no', {
      type: Sequelize.STRING,
      after: "description"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('certificates', 'certificate_no');
  }
};

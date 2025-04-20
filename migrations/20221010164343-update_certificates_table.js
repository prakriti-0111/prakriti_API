'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('certificates', 'website', {
      type: Sequelize.STRING,
      after: "certificate_no"
    });
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('certificates', 'website');
}
};

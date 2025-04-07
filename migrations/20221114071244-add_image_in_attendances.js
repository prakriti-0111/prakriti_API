'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('attendances', 'image', {
      type: Sequelize.STRING,
      after: "late_reason"
    });
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('attendances', 'image');
}
};

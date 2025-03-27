'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('roles', 'is_custom', {
      type: Sequelize.BOOLEAN,
      after: "description",
      defaultValue: false
    });
},

async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('roles', 'is_custom');
}
};

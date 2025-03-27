'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('returns', 'req_data', {
      type: Sequelize.TEXT('long'),
      after: "return_date",
    });
    await queryInterface.addColumn('returns', 'seller_id', {
      type: Sequelize.INTEGER,
      after: "user_id",
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('returns', 'req_data');
   await queryInterface.removeColumn('returns', 'seller_id');
  }
};

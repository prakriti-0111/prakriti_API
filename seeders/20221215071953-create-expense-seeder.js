'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

     return queryInterface.bulkInsert('reasons', [{
        name: 'Transportation',
        type: 'expense'
     },
     {
       name: 'Fuel',
       type: 'expense'
     },
     {
       name: 'Food',
       type: 'expense'
     },
     {
      name: 'Other',
      type: 'other'
    },
     ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

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

     return queryInterface.bulkInsert('roles', [
      {
        name: 'superadmin',
        display_name: 'Super Admin'
      },
      {
        name: 'admin',
        display_name: 'Admin',
      },
      {
        name: 'distributor',
        display_name: 'Distributor',
      },
      {
        name: 'sales_executive',
        display_name: 'Sales Executive',
      },
      {
        name: 'retailer',
        display_name: 'Retailer',
      },
      {
        name: 'customer',
        display_name: 'Customer',
      },
      {
        name: 'employee',
        display_name: 'Employee',
      },
      {
        name: 'supplier',
        display_name: 'Supplier',
      },
      {
        name: 'manager',
        display_name: 'Manager',
      },
      {
        name: 'worker',
        display_name: 'Worker',
      },
      {
        name: 'investor',
        display_name: 'Investor',
      }
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

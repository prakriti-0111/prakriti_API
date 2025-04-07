'use strict';

var bcrypt = require("bcryptjs");


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
    return queryInterface.bulkInsert('users', [{
      email: 'superadmin@gmail.com',
      name: 'Super Admin',
      mobile: '1000000001',
      role_id:1,
      password: bcrypt.hashSync('12345', 8)
    },
    /*{
      email: 'admin@gmail.com',
      name: 'Admin',
      mobile: '1000000002',
      role_id:2,
      password: bcrypt.hashSync('123456', 8)
    },
    {
      email: 'testdistributor@gmail.com',
      name: 'Distributor',
      mobile: '1000000003',
      role_id:3,
      password: bcrypt.hashSync('123456', 8)
    },
    {
      email: 'testexecutive@gmail.com',
      name: 'Sales Executive',
      mobile: '1000000004',
      role_id:4,
      password: bcrypt.hashSync('123456', 8)
    },
    {
      email: 'testretailer@gmail.com',
      name: 'Retailer',
      mobile: '1000000005',
      role_id:5,
      password: bcrypt.hashSync('123456', 8)
    },
    {
      email: 'testcustomer@gmail.com',
      name: 'Customer',
      mobile: '1000000006',
      role_id:6,
      password: bcrypt.hashSync('123456', 8)
    },
    {
      email: 'testmanager@gmail.com',
      name: 'Manager',
      mobile: '1000000007',
      role_id: 9,
      password: bcrypt.hashSync('123456', 8)
    },*/
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

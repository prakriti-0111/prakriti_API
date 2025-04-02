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
    let allStates = [ "Andhra Pradesh",
     "Arunachal Pradesh",
     "Assam",
     "Bihar",
     "Chhattisgarh",
     "Goa",
     "Gujarat",
     "Haryana",
     "Himachal Pradesh",
     "Jammu and Kashmir",
     "Jharkhand",
     "Karnataka",
     "Kerala",
     "Madhya Pradesh",
     "Maharashtra",
     "Manipur",
     "Meghalaya",
     "Mizoram",
     "Nagaland",
     "Odisha",
     "Punjab",
     "Rajasthan",
     "Sikkim",
     "Tamil Nadu",
     "Telangana",
     "Tripura",
     "Uttarakhand",
     "Uttar Pradesh",
     "West Bengal",
     "Andaman and Nicobar Islands",
     "Chandigarh",
     "Dadra and Nagar Haveli",
     "Daman and Diu",
     "Delhi",
     "Lakshadweep",
     "Puducherry"
    ];
    let newArr = [];
    for(let i of allStates){
      newArr.push({country_id: 1, name: i});
    }
    //return queryInterface.bulkInsert('states', newArr);
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

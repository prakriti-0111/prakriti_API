'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'city', {
      type: Sequelize.STRING,
      after: "pincode"
    });
    await queryInterface.addColumn('users', 'p_country_id', {
      type: Sequelize.INTEGER,
      after: "city"
    });
    await queryInterface.addColumn('users', 'p_state_id', {
      type: Sequelize.INTEGER,
      after: "p_country_id"
    });
    await queryInterface.addColumn('users', 'p_district_id', {
      type: Sequelize.INTEGER,
      after: "p_state_id"
    });
    await queryInterface.addColumn('users', 'p_pincode', {
      type: Sequelize.STRING(30),
      after: "p_district_id"
    });
    await queryInterface.addColumn('users', 'p_city', {
      type: Sequelize.STRING,
      after: "p_district_id"
    });
    await queryInterface.addColumn('users', 'p_address', {
      type: Sequelize.TEXT,
      after: "p_city"
    });
    await queryInterface.addColumn('users', 'adhar', {
      type: Sequelize.STRING(50),
      after: "p_address"
    });
    await queryInterface.addColumn('users', 'pan', {
      type: Sequelize.STRING(50),
      after: "adhar"
    });
    await queryInterface.addColumn('users', 'company_name', {
      type: Sequelize.STRING,
      after: "pan"
    });
    await queryInterface.addColumn('users', 'gst', {
      type: Sequelize.STRING(100),
      after: "company_name"
    });
    await queryInterface.addColumn('users', 'bank_name', {
      type: Sequelize.STRING,
      after: "gst"
    });
    await queryInterface.addColumn('users', 'bank_account_no', {
      type: Sequelize.STRING(100),
      after: "bank_name"
    });
    await queryInterface.addColumn('users', 'bank_ifsc', {
      type: Sequelize.STRING(100),
      after: "bank_account_no"
    });
    await queryInterface.addColumn('users', 'pan_image', {
      type: Sequelize.STRING,
      after: "bank_ifsc"
    });
    await queryInterface.addColumn('users', 'adhar_image', {
      type: Sequelize.STRING,
      after: "pan_image"
    });
    await queryInterface.addColumn('users', 'company_logo', {
      type: Sequelize.STRING,
      after: "adhar_image"
    });
    await queryInterface.addColumn('users', 'status', {
      type: Sequelize.BOOLEAN,
      after: "company_logo"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'city');
    await queryInterface.removeColumn('users', 'p_country_id');
    await queryInterface.removeColumn('users', 'p_state_id');
    await queryInterface.removeColumn('users', 'p_district_id');
    await queryInterface.removeColumn('users', 'p_pincode');
    await queryInterface.removeColumn('users', 'p_city');
    await queryInterface.removeColumn('users', 'p_address');
    await queryInterface.removeColumn('users', 'adhar');
    await queryInterface.removeColumn('users', 'pan');
    await queryInterface.removeColumn('users', 'company_name');
    await queryInterface.removeColumn('users', 'gst');
    await queryInterface.removeColumn('users', 'bank_name');
    await queryInterface.removeColumn('users', 'bank_account_no');
    await queryInterface.removeColumn('users', 'bank_ifsc');
    await queryInterface.removeColumn('users', 'pan_image');
    await queryInterface.removeColumn('users', 'adhar_image');
    await queryInterface.removeColumn('users', 'company_logo');
    await queryInterface.removeColumn('users', 'status');
  }
};

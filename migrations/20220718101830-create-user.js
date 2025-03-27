'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      designation_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      state_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      country_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      mobile: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.TEXT
      },
      pincode: {
        type: Sequelize.STRING
      },
      google_id: {
        type: Sequelize.STRING
      },
      facebook_id: {
        type: Sequelize.STRING
      },
      twitter_id: {
        type: Sequelize.STRING
      },
      apple_id: {
        type: Sequelize.STRING
      },
      profile_image: {
        type: Sequelize.STRING
      },
      id_proof_image: {
        type: Sequelize.STRING
      },
      address_proof_image: {
        type: Sequelize.STRING
      },
      createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
          field: 'updated_at',
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('NOW')
      },
      deletedAt: {
        field: 'deleted_at',
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
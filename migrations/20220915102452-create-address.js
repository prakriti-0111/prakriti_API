'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      type: {
        allowNull: true,
        type: Sequelize.STRING
      },
      name: {
        allowNull: true,
        type: Sequelize.STRING
      },
      street: {
        allowNull: true,
        type: Sequelize.STRING
      },
      landmark: {
        allowNull: true,
        type: Sequelize.STRING
      },
      city: {
        allowNull: true,
        type: Sequelize.STRING(50)
      },
      state: {
        allowNull: true,
        type: Sequelize.STRING(50)
      },
      zipcode: {
        allowNull: true,
        type: Sequelize.STRING(15)
      },
      country: {
        allowNull: true,
        type: Sequelize.STRING(50)
      },
      contact: {
        allowNull: true,
        type: Sequelize.STRING(12)
      },
      lat: {
        allowNull: true,
        type: Sequelize.DECIMAL(10, 6)
      },
      lng: {
        allowNull: true,
        type: Sequelize.DECIMAL(10, 6)
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
    await queryInterface.dropTable('addresses');
  }
};
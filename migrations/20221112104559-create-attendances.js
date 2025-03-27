'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING(10)
      },
      city: {
        type: Sequelize.STRING(50)
      },
      state: {
        type: Sequelize.STRING(50)
      },
      country: {
        type: Sequelize.STRING(50)
      },
      zipcode: {
        type: Sequelize.STRING(10)
      },
      lat: {
        type: Sequelize.STRING
      },
      lng: {
        type: Sequelize.STRING
      },
      late_reason: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING(20)
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
    await queryInterface.dropTable('attendances');
  }
};
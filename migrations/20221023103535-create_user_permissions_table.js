'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_permissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      role_id: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(150)
      },
      list: {
        type: Sequelize.BOOLEAN
      },
      view: {
        type: Sequelize.BOOLEAN
      },
      add: {
        type: Sequelize.BOOLEAN
      },
      edit: {
        type: Sequelize.BOOLEAN
      },
      delete: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('user_permissions');
  }
};
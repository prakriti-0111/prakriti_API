'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('retailer_visits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      visit_user_id: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING(100)
      },
      date: {
        type: Sequelize.DATEONLY
      },
      notes: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('retailer_visits');
  }
};
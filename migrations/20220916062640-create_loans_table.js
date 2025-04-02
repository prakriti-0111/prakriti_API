'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('loans', {
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
      principal_amount: {
        allowNull: true,
        type: Sequelize.DECIMAL(15, 2)
      },
      interest: {
        allowNull: true,
        type: Sequelize.DECIMAL(15, 2)
      },
      total_months: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      due_amount: {
        allowNull: true,
        type: Sequelize.DECIMAL(15, 2)
      },
      start_date: {
        allowNull: true,
        type: Sequelize.DATEONLY
      },
      status: {
        allowNull: true,
        type: Sequelize.STRING(30)
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
    await queryInterface.dropTable('loans');
  }
};
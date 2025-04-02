'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('loan_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      loan_id: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      type: {
        allowNull: true,
        type: Sequelize.STRING(30)
      },
      transaction_type: {
        allowNull: true,
        type: Sequelize.STRING(30)
      },
      principal_amount: {
        allowNull: true,
        type: Sequelize.DECIMAL(15, 2)
      },
      principal_due_amount: {
        allowNull: true,
        type: Sequelize.DECIMAL(15, 2)
      },
      interest_amount: {
        allowNull: true,
        type: Sequelize.DECIMAL(15, 2)
      },
      amount: {
        allowNull: true,
        type: Sequelize.DECIMAL(15, 2)
      },
      interest_due_date: {
        allowNull: true,
        type: Sequelize.DATEONLY
      },
      payment_receive_date: {
        allowNull: true,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('loan_details');
  }
};
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      payment_by: {
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2)
      },
      payment_date: {
        type: Sequelize.DATE
      },
      payment_mode: {
        type: Sequelize.STRING(20),
      },
      notes: {
        type: Sequelize.STRING()
      },
      cheque_no: {
        type: Sequelize.STRING(50),
      },
      txn_id: {
        type: Sequelize.STRING(100),
      },
      status: {
        type: Sequelize.STRING(20),
      },
      type: {
        type: Sequelize.STRING(50),
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
    await queryInterface.dropTable('payments');
  }
};
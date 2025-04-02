'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('returns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      table_type: {
        type: Sequelize.STRING(50)
      },
      table_id: {
        type: Sequelize.INTEGER
      },
      notes: {
        type: Sequelize.TEXT
      },
      payment_mode: {
        type: Sequelize.STRING(30)
      },
      txn_id: {
        type: Sequelize.STRING(100)
      },
      cheque_no: {
        type: Sequelize.STRING(100)
      },
      total_amount: {
        type: Sequelize.DECIMAL(15, 2)
      },
      status: {
        type: Sequelize.STRING(30)
      },
      accepted_at: {
        type: Sequelize.DATE
      },
      declined_at: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('returns');
  }
};
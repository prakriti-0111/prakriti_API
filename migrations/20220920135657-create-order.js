'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      order_no: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      sub_total: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      discount_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      total_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      payment_mode: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      delivery_address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: true
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
    await queryInterface.dropTable('orders');
  }
};
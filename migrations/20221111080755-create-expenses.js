'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('expenses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reason_id: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      description: {
        type: Sequelize.STRING
      },
      bill_image: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2)
      },
      explanation: {
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
    await queryInterface.dropTable('expenses');
  }
};
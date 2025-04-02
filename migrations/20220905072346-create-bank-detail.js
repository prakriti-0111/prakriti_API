'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bank_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      salary: {
        type: Sequelize.DECIMAL(10,2)
      },
      bank_name: {
        type: Sequelize.STRING
      },
      account_no: {
        type: Sequelize.STRING
      },
      ifsc_code: {
        type: Sequelize.STRING
      },
      paid_leave: {
        type: Sequelize.STRING
      },
      parent_name: {
        type: Sequelize.STRING
      },
      alternative_no: {
        type: Sequelize.STRING
      },
      alternative_address: {
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
    await queryInterface.dropTable('bank_details');
  }
};
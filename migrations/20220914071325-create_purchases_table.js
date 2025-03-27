'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('purchases', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      supplier_id: {
        type: Sequelize.INTEGER
      },
      invoice_number: {
        type: Sequelize.STRING(100)
      },
      invoice_date: {
        type: Sequelize.DATEONLY
      },
      notes: {
        type: Sequelize.TEXT
      },
      payment_mode: {
        type: Sequelize.STRING(30)
      },
      transaction_no: {
        type: Sequelize.STRING(30)
      },
      total_amount: {
        type: Sequelize.DECIMAL(15, 2)
      },
      tax: {
        type: Sequelize.DECIMAL(15, 2)
      },
      discount: {
        type: Sequelize.DECIMAL(15, 2)
      },
      paid_amount: {
        type: Sequelize.DECIMAL(15, 2)
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

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('purchases');
  }
};

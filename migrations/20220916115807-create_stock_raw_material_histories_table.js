'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('stock_raw_material_histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      from_user_id: {
        type: Sequelize.INTEGER
      },
      to_user_id: {
        type: Sequelize.INTEGER
      },
      material_id: {
        type: Sequelize.INTEGER
      },
      batch_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      weight: {
        type: Sequelize.DECIMAL(15, 3),
        allowNull: true
      },
      unit_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      type: {
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

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('stock_raw_material_histories');
  }
};

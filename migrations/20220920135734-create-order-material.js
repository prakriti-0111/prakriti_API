'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_materials', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      material_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      size_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      purchase_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      sale_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      weight: {
        type: Sequelize.DECIMAL(15, 3),
        allowNull: true
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      discount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },
      discount_type: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      total: {
        type: Sequelize.DECIMAL(15, 2),
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
    await queryInterface.dropTable('order_materials');
  }
};
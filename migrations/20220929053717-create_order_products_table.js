'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER
      },
      size_id: {
        type: Sequelize.INTEGER
      },
      certificate_no: {
        type: Sequelize.STRING(30)
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      discount: {
        type: Sequelize.DECIMAL(15, 2)
      },
      discount_type: {
        type: Sequelize.STRING(30)
      },
      rate: {
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_products');
  }
};
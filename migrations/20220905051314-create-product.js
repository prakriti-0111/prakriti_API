'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      category_id: {
        type: Sequelize.INTEGER
      },
      sub_category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      tax_rate_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      product_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      certificate_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      licence_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      images: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      video: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('products');
  }
};
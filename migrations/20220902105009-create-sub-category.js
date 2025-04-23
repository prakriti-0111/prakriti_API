'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sub_categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      category_id: {
        field: 'category_id',
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      slug: {
        type: Sequelize.STRING
      },
      making_charge_type: {
        type: Sequelize.STRING
      },
      making_charge: {
        type: Sequelize.DECIMAL(10, 2)
      },
      status: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('sub_categories');
  }
};
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('salary_structures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      role_id: {
        type: Sequelize.INTEGER
      },
      gross_salary: {
        type: Sequelize.DECIMAL(10, 2)
      },
      basic_salary: {
        type: Sequelize.DECIMAL(10, 2)
      },
      eff_date: {
        type: Sequelize.DATEONLY
      },
      is_epf: {
        type: Sequelize.TINYINT(1)
      },
      is_medical: {
        type: Sequelize.TINYINT(1)
      },
      target: {
        type: Sequelize.BIGINT
      },
      visit_target: {
        type: Sequelize.BIGINT
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
    await queryInterface.dropTable('salary_structures');
  }
};
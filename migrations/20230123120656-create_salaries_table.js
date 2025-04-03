'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('salaries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      absent: {
        type: Sequelize.INTEGER
      },
      work_days: {
        type: Sequelize.INTEGER
      },
      gross: {
        type: Sequelize.DECIMAL(15, 2)
      },
      wages: {
        type: Sequelize.DECIMAL(15, 2)
      },
      basic: {
        type: Sequelize.DECIMAL(15, 2)
      },
      hra: {
        type: Sequelize.DECIMAL(15, 2)
      },
      conveyance: {
        type: Sequelize.DECIMAL(15, 2)
      },
      special: {
        type: Sequelize.DECIMAL(15, 2)
      },
      ptax: {
        type: Sequelize.DECIMAL(15, 2)
      },
      epf_employee: {
        type: Sequelize.DECIMAL(15, 2)
      },
      epf_employer: {
        type: Sequelize.DECIMAL(15, 2)
      },
      medical_employee: {
        type: Sequelize.DECIMAL(15, 2)
      },
      medical_employer: {
        type: Sequelize.DECIMAL(15, 2)
      },
      actual_gross: {
        type: Sequelize.DECIMAL(15, 2)
      },
      actual_basic: {
        type: Sequelize.DECIMAL(15, 2)
      },
      absent_amount: {
        type: Sequelize.DECIMAL(15, 2)
      },
      net: {
        type: Sequelize.DECIMAL(15, 2)
      },
      total: {
        type: Sequelize.DECIMAL(15, 2)
      },
      is_epf: {
        type: Sequelize.BOOLEAN
      },
      is_medical: {
        type: Sequelize.BOOLEAN
      },
      salary_date: {
        type: Sequelize.DATEONLY
      },
      status: {
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('salaries');
  }
};
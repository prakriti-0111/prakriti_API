'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('salary_structures', 'hra_percent', {
      type: Sequelize.DECIMAL(6, 2),
      after: "incentive"
    });
    await queryInterface.addColumn('salary_structures', 'conv_percent', {
      type: Sequelize.DECIMAL(6, 2),
      after: "hra_percent"
    });
    await queryInterface.addColumn('salary_structures', 'epf_employee_percent', {
      type: Sequelize.DECIMAL(6, 2),
      after: "conv_percent"
    });
    await queryInterface.addColumn('salary_structures', 'epf_employer_percent', {
      type: Sequelize.DECIMAL(6, 2),
      after: "epf_employee_percent"
    });
    await queryInterface.addColumn('salary_structures', 'medical_employee_percent', {
      type: Sequelize.DECIMAL(6, 2),
      after: "epf_employer_percent"
    });
    await queryInterface.addColumn('salary_structures', 'medical_employer_percent', {
      type: Sequelize.DECIMAL(6, 2),
      after: "medical_employee_percent"
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('salary_structures', 'hra_percent');
    await queryInterface.removeColumn('salary_structures', 'conv_percent');
    await queryInterface.removeColumn('salary_structures', 'epf_employee_percent');
    await queryInterface.removeColumn('salary_structures', 'epf_employer_percent');
    await queryInterface.removeColumn('salary_structures', 'medical_employee_percent');
    await queryInterface.removeColumn('salary_structures', 'medical_employer_percent');
  }
};

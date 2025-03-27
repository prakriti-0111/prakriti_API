'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('order_materials', 'rate', {
      type: Sequelize.DECIMAL(15, 2),
      after: "status"
    });
    await queryInterface.addColumn('order_materials', 'discount_percent', {
      type: Sequelize.DECIMAL(15, 2),
      after: "rate"
    });
    await queryInterface.addColumn('order_materials', 'total_gram', {
      type: Sequelize.DECIMAL(15, 3),
      after: "discount_percent"
    });
    await queryInterface.addColumn('order_materials', 'per_gram_price', {
      type: Sequelize.DECIMAL(15, 2),
      after: "total_gram"
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.removeColumn('order_materials', 'rate');
     await queryInterface.removeColumn('order_materials', 'discount_percent');
     await queryInterface.removeColumn('order_materials', 'total_gram');
     await queryInterface.removeColumn('order_materials', 'per_gram_price');
  }
};

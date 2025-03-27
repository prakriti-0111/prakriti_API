'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('sale_product_materials', 'max_discount_percent', {
      type: Sequelize.DECIMAL(15, 2),
      after: "discount_percent"
    });
    await queryInterface.addColumn('sale_product_materials', 'total_gram', {
      type: Sequelize.DECIMAL(15, 3),
      after: "max_discount_percent"
    });
    await queryInterface.addColumn('sale_product_materials', 'per_gram_price', {
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
    await queryInterface.removeColumn('sale_product_materials', 'max_discount_percent');
    await queryInterface.removeColumn('sale_product_materials', 'total_gram');
    await queryInterface.removeColumn('sale_product_materials', 'per_gram_price');
  }
};

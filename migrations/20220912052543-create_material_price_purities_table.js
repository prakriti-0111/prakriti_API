'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('material_price_purities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      material_price_id: {
        type: Sequelize.INTEGER
      },
      purity_id: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.DECIMAL(10, 2)
      },
      admin_discount: {
        type: Sequelize.DECIMAL(10, 2)
      },
      distributor_discount: {
        type: Sequelize.DECIMAL(10, 2)
      },
      se_discount: {
        type: Sequelize.DECIMAL(10, 2)
      },
      retailer_max_discount: {
        type: Sequelize.DECIMAL(10, 2)
      },
      customer_discount: {
        type: Sequelize.DECIMAL(10, 2)
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
     await queryInterface.dropTable('material_price_purities');
  }
};

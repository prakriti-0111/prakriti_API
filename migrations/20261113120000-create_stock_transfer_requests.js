'use strict';

/* An SE asks its admin to transfer stock pieces it needs for an order. The
   admin then puts those pieces in its cart and sells them to the SE. */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('stock_transfer_requests', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      order_id: { type: Sequelize.INTEGER, allowNull: false },
      sales_executive_id: { type: Sequelize.INTEGER, allowNull: false },
      admin_id: { type: Sequelize.INTEGER, allowNull: false },
      // JSON array of the admin's stock ids asked for
      stock_ids: { type: Sequelize.TEXT, allowNull: false },
      // pending -> added_to_cart
      status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: 'pending' },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE },
      deleted_at: { type: Sequelize.DATE },
    });
    await queryInterface.addIndex('stock_transfer_requests', ['order_id']);
    await queryInterface.addIndex('stock_transfer_requests', ['admin_id', 'status']);
  },

  async down (queryInterface) {
    await queryInterface.dropTable('stock_transfer_requests');
  }
};

'use strict';

/* the order items the SE asked for (it picks them on the order) - the admin
   may hold some, all or none of their pieces */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('stock_transfer_requests', 'order_product_ids', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'admin_id',
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('stock_transfer_requests', 'order_product_ids');
  }
};

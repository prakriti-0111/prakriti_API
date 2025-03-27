'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addIndex('carts', ['id', 'product_id', 'size_id', 'user_id', 'cookie_id'], {name: 'cart_indexing'});
    await queryInterface.addIndex('cart_materials', ['id', 'cart_id', 'material_id', 'purity_id', 'unit_id'], {name: 'cart_materials_indexing'});
    await queryInterface.addIndex('categories', ['id'], {name: 'categories_indexing'});
    await queryInterface.addIndex('certificates', ['id'], {name: 'certificates_indexing'});
    await queryInterface.addIndex('countries', ['id'], {name: 'countries_indexing'});
    await queryInterface.addIndex('districts', ['id', 'country_id', 'state_id'], {name: 'districts_indexing'});
    await queryInterface.addIndex('expenses', ['id', 'reason_id'], {name: 'expenses_indexing'});
    await queryInterface.addIndex('loans', ['id', 'user_id'], {name: 'loans_indexing'});
    await queryInterface.addIndex('loan_details', ['id', 'loan_id'], {name: 'loan_details_indexing'});
    await queryInterface.addIndex('materials', ['id', 'category_id', 'unit_id'], {name: 'materials_indexing'});
    await queryInterface.addIndex('material_prices', ['id', 'material_id'], {name: 'material_prices_indexing'});
    await queryInterface.addIndex('material_price_purities', ['id', 'material_price_id', 'purity_id'], {name: 'material_price_purities_indexing'});
    await queryInterface.addIndex('material_purities', ['id', 'material_id', 'purity_id'], {name: 'material_purities_indexing'});
    await queryInterface.addIndex('notifiactions', ['user_id'], {name: 'notifiactions_indexing'});
    await queryInterface.addIndex('orders', ['id', 'user_id', 'to_user_id', 'sales_executive_id', 'order_no'], {name: 'orders_indexing'});
    await queryInterface.addIndex('order_materials', ['id', 'order_id', 'product_id', 'material_id', 'size_id', 'purity_id', 'unit_id'], {name: 'order_materials_indexing'});
    await queryInterface.addIndex('order_products', ['id', 'order_id', 'product_id', 'size_id'], {name: 'order_products_indexing'});
    await queryInterface.addIndex('payments', ['id', 'parent_id', 'user_id', 'payment_by', 'table_type', 'table_id'], {name: 'payments_indexing'});
    await queryInterface.addIndex('products', ['id', 'name', 'category_id', 'sub_category_id', 'tax_rate_id', 'product_code', 'certificate_id', 'weight'], {name: 'products_indexing'});
    await queryInterface.addIndex('product_certificates', ['id', 'product_id', 'certificate_id'], {name: 'product_certificates_indexing'});
    await queryInterface.addIndex('product_materials', ['id', 'product_id', 'material_id'], {name: 'product_materials_indexing'});
    await queryInterface.addIndex('product_sizes', ['id', 'product_id', 'size_id'], {name: 'product_sizes_indexing'});
    await queryInterface.addIndex('product_size_materials', ['id', 'product_id', 'size_id', 'material_id', 'unit_id'], {name: 'product_size_materials_indexing'});
    await queryInterface.addIndex('product_tags', ['product_id'], {name: 'product_tags_indexing'});
    await queryInterface.addIndex('purchases', ['id', 'supplier_id', 'user_id', 'sale_id', 'invoice_date', 'is_assigned'], {name: 'purchases_indexing'});
    await queryInterface.addIndex('purchase_products', ['id', 'purchase_id', 'product_id', 'size_id'], {name: 'purchase_products_indexing'});
    await queryInterface.addIndex('purchase_product_materials', ['id', 'purchase_id', 'purchase_product_id', 'material_id', 'purity_id', 'unit_id'], {name: 'purchase_product_materials_indexing'});
    await queryInterface.addIndex('purities', ['id', 'name'], {name: 'purities_indexing'});
    await queryInterface.addIndex('returns', ['id', 'parent_id', 'seller_id', 'table_type', 'table_id'], {name: 'returns_indexing'});
    await queryInterface.addIndex('return_products', ['id', 'return_id', 'table_type', 'table_id', 'product_id'], {name: 'return_products_indexing'});
    await queryInterface.addIndex('return_product_materials', ['id', 'return_id', 'return_product_id', 'material_id', 'purity_id', 'unit_id'], {name: 'return_product_materials_indexing'});
    await queryInterface.addIndex('sales', ['id', 'user_id', 'order_id', 'sale_by', 'invoice_date'], {name: 'sales_indexing'});
    await queryInterface.addIndex('sale_products', ['id', 'sale_id', 'product_id', 'size_id'], {name: 'sale_products_indexing'});
    await queryInterface.addIndex('sale_product_materials', ['id', 'sale_id', 'sale_product_id', 'material_id', 'purity_id', 'unit_id'], {name: 'sale_product_materials_indexing'});
    await queryInterface.addIndex('sizes', ['id', 'category_id', 'sub_category_id'], {name: 'sizes_indexing'});
    await queryInterface.addIndex('states', ['id', 'country_id'], {name: 'states_indexing'});
    await queryInterface.addIndex('stocks', ['id', 'product_id', 'size_id', 'purchase_id', 'user_id', 'total_weight'], {name: 'stocks_indexing'});
    await queryInterface.addIndex('stock_materials', ['id', 'stock_id', 'category_id', 'material_id', 'purity_id', 'unit_id'], {name: 'stock_materials_indexing'});
    await queryInterface.addIndex('sub_categories', ['id', 'category_id'], {name: 'sub_categories_indexing'});
    await queryInterface.addIndex('tax_slabs', ['id'], {name: 'tax_slabs_indexing'});
    await queryInterface.addIndex('units', ['id'], {name: 'units_indexing'});
    await queryInterface.addIndex('users', ['id', 'parent_id', 'state_id', 'district_id', 'country_id'], {name: 'users_indexing'});
    await queryInterface.addIndex('user_permissions', ['id', 'role_id'], {name: 'user_permissions_indexing'});
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

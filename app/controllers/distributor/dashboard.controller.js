const { formatResponse } = require("@utils/response.config");
const { UserCollection } = require("@resources/admin/UserCollection");
const { getRoleId } = require("@library/common");
const db = require("@models");
const sequelize = db.sequelize;
const { Op, QueryTypes } = require("sequelize");
const UserModel = db.users;
const StockModel = db.stocks;
const OrderModel = db.orders;
const RoleModel = db.roles;

/**
 * Super Admin Dashboard
 *
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
    let customerRoleId = getRoleId('customer');
    let totalSaleExecutive = 0;
    let totalRetailer = 0;
    let totalStock = await StockModel.count({ where: { user_id: req.userId } });
    let totalPendingOrders = await OrderModel.count({ where: { to_user_id: req.userId, status: 'pending' } });

    const orders = await sequelize.query("SELECT COUNT(orders.id) as total_order FROM orders INNER JOIN users ON users.id = orders.user_id WHERE orders.to_user_id = " + req.userId + " AND users.role_id = " + customerRoleId + " AND orders.deleted_at IS NULL GROUP BY orders.user_id", { type: QueryTypes.SELECT });
    let totalCustomer = orders.length ? orders[0].total_order : 0;

    let result = {
        total_sale_executive: totalSaleExecutive,
        total_retailer: totalRetailer,
        total_customer: totalCustomer,
        total_stock: totalStock,
        total_pending_orders: totalPendingOrders
    }
    res.send(formatResponse(result, "Dashboard"));
}
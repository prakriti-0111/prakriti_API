const { formatResponse } = require("@utils/response.config");
const {UserCollection} = require("@resources/admin/UserCollection");
const { getRoleId } = require("@library/common");
const db = require("@models");
const { Op } = require("sequelize");
const UserModel = db.users;
const StockModel = db.stocks;
const OrderModel = db.orders;

/**
 * Super Admin Dashboard
 *
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
    let user = await UserModel.findOne({where: {id: req.userId}});
    let state_id = user.state_id || 0;
    let distributorRoleId = getRoleId('distributor');
    let totalDistributor = await UserModel.count({where: {role_id: distributorRoleId, state_id: state_id}});
    let totalStock = await StockModel.count({where: {user_id: req.userId}});
    let totalPendingOrders = await OrderModel.count({where: {to_user_id: req.userId, status: 'pending'}});

    let result = {
        total_distributor: totalDistributor,
        total_stock: totalStock,
        total_pending_orders: totalPendingOrders
    }
    res.send(formatResponse(result, "Dashboard"));
}
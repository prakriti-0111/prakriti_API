const { formatResponse } = require("@utils/response.config");
const {UserCollection} = require("@resources/admin/UserCollection");
const { getRoleId, isDistributor, getUserColumnValue } = require("@library/common");
const {PermissionCollection} = require("@resources/superadmin/PermissionCollection");
const db = require("@models");
const { Op } = require("sequelize");
const UserModel = db.users;
const OrderModel = db.orders;
const UserPermissionModel = db.user_permissions;

/**
 * Employee Dashboard
 *
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
    let workerRoleId = getRoleId('worker');
    let totalWorkers = await UserModel.count({where: {role_id: workerRoleId, parent_id: req.userId}});

    let result = {
        total_workers: totalWorkers
    }
    res.send(formatResponse(result, "Dashboard"));
}


/**
 * Get Permission
 *
 * @param req
 * @param res
 */
exports.permissions = async (req, res) => {
    let permissions = await UserPermissionModel.findAll({
        where: {role_id: req.role}
    });
    permissions = PermissionCollection(permissions);
    if(isDistributor(req)){
        let have_expense = await getUserColumnValue(req.userId, 'expense');
        if(have_expense){
            permissions.push({
            name: 'expense',
            list: true,
            view: true,
            add: true,
            edit: true,
            delete: true
          });
        }
    }

    res.send(formatResponse({
        permissions: permissions
    }, "Permissions"));
}
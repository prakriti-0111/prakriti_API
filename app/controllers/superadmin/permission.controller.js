const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const { getPaginationOptions } = require('@helpers/paginator');
const db = require("@models");
const { gePermissionValue, updateOrCreate, isDistributor, getUserColumnValue } = require("@library/common");
const {PermissionCollection} = require("@resources/superadmin/PermissionCollection");
const UserPermissionModel = db.user_permissions;
const UserModel = db.users;

/**
 * Retrieve all permission
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, role_id } = req.query;
  const paginatorOptions = getPaginationOptions(page, limit);
  UserPermissionModel.findAndCountAll({
    order:[['id', 'ASC']],
    offset: paginatorOptions.offset,
    limit: paginatorOptions.limit,
    where: {role_id: role_id}
  }).then(async (data) => {
    let result = {
      items: PermissionCollection(data.rows),
      total: data.count
    }
    res.send(formatResponse(result, 'Permissions'));
  })
  .catch(err => {
    res.status(errorCodes.default).send(formatErrorResponse(err));
  });
};

/**
 * Update Permissions
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.update = async (req, res) => {
  let data = req.body;

  await updateOrCreate(UserPermissionModel, {
    name: data.name,
    role_id: data.role_id
  }, {
    name: data.name,
    role_id: data.role_id,
    list: data.list,
    view: data.view,
    add: data.add,
    edit: data.edit,
    delete: data.delete
  });

  res.send(formatResponse("", 'Permissions Updated.'));

  req.pusher.trigger("Prakriti_channel", "permission_updated", {});

};

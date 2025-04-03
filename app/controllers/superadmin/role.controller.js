const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { Op } = require("sequelize");
const { getPaginationOptions } = require('@helpers/paginator')
const {getRoleId, updateOrCreate} = require("@library/common");
const { convertToSlug } = require("@helpers/helper");
const {RoleCollection} = require("@resources/superadmin/RoleCollection");
const RoleModel = db.roles;
const UserPermissionModel = db.user_permissions;

/**
 * Retrieve all categories
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, all, se } = req.query;
  let extraRoleIds = [getRoleId('manager'), getRoleId('worker')];
  if(se == 1){
    extraRoleIds.push(getRoleId('sales_executive'));
  }
  let condition = {[Op.or]: [{is_custom: true}, {is_custom: false, id: {[Op.in]: extraRoleIds}}]};
  if(all == 1){
    RoleModel.findAll({ 
      order:[['name', 'ASC']],
      where: condition
    }).then(async (data) => {
      let result = {
        items: await RoleCollection(data),
        total: data.length
      }
      res.send(formatResponse(result, 'Roles'));
    })
    .catch(err => {
      res.status(errorCodes.default).send(formatErrorResponse(err));
    });
  }else{
    const paginatorOptions = getPaginationOptions(page, limit);
    RoleModel.findAndCountAll({ 
        order:[['id', 'DESC']],
        where: condition,
        offset: paginatorOptions.offset,
        limit: paginatorOptions.limit,
      }).then(async (data) => {
        let result = {
          items: await RoleCollection(data.rows),
          total: data.count,
        }
        res.send(formatResponse(result, 'Roles'));
      })
      .catch(err => {
        res.status(errorCodes.default).send(formatErrorResponse(err));
      });
    };
  }

/**
 * Create categories
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
  let data = req.body;

  /**
   * check unique custom role
   */
  let isExist = await RoleModel.findOne({where: {name: data.name, is_custom: true}});
  if(isExist){
    return res.status(errorCodes.default).send(formatErrorResponse('This role is already exist.'));
  }

  const postData = {
    name: data.name,
    display_name: data.name,
    is_custom: true
  };

  RoleModel.create(postData).then(async(result) => {

    await UserPermissionModel.create({
      role_id: result.id,
      master: data.permissions.master,
      product_master: data.permissions.product_master,
      user_management: data.permissions.user_management,
      employee: data.permissions.employee,
      investor: data.permissions.investor,
      stock: data.permissions.stock,
      invoice: data.permissions.invoice,
      orders: data.permissions.orders,
      hr_management: data.permissions.hr_management,
      settings: data.permissions.settings
    });

    res.send(formatResponse("", "Role created successfully!"));
  }).catch(error => {
    return res.status(errorCodes.default).send(formatErrorResponse('Role does not created due to some error'));
  }); 
};


/**
 * View Role
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.fetch = async (req, res) => {
  let category = await RoleModel.findOne({ where: { id: req.params.id, is_custom: true } });
  if (!category) {
    return res.status(errorCodes.default).send(formatErrorResponse('Role not found'));
  }
  res.send(formatResponse(await RoleCollection(category), "Role fetched successfully!"));
};



/**
 * Update Role
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.update = async (req, res) => {
  let data = req.body;
  /**
   * check unique custom role
   */
  let isExist = await RoleModel.findOne({where: {name: data.name, is_custom: true, id: {[Op.ne]: req.params.id }}});
  if(isExist){
    return res.status(errorCodes.default).send(formatErrorResponse('This role is already exist.'));
  }

  const postData = {
    name: data.name
  };
  RoleModel.update(postData, { where: { id: req.params.id, is_custom: true } }).then(async(result) => {

    await updateOrCreate(UserPermissionModel, {role_id: req.params.id}, {
      role_id: req.params.id,
      master: data.permissions.master,
      product_master: data.permissions.product_master,
      user_management: data.permissions.user_management,
      employee: data.permissions.employee,
      investor: data.permissions.investor,
      stock: data.permissions.stock,
      invoice: data.permissions.invoice,
      orders: data.permissions.orders,
      hr_management: data.permissions.hr_management,
      settings: data.permissions.settings
    });

    req.pusher.trigger("Prakriti_channel", "permission_updated", {});

    res.send(formatResponse("", "Role updated successfully!"));
  }).catch(error => {
    return res.status(errorCodes.default).send(formatErrorResponse('Role does not updated due to some error'));
  });
};



  
/**
 * delete Role
 * 
 * @param {*} req
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  RoleModel.destroy({ where: { id: req.params.id, is_custom: true } }).then(result => {
    res.send(formatResponse("", 'Role deleted Successfully!'));
  }).catch(error => {
    return res.status(errorCodes.default).send(formatErrorResponse(error));
  });
};
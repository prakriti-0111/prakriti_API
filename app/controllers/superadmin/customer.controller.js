const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const { getPaginationOptions } = require('@helpers/paginator');
const { base64FileUpload, removeFile } = require('@helpers/upload');
const { isEmpty } = require("@helpers/helper");
const db = require("@models");
const { Op } = require("sequelize");
const { getRoleId, isDistributor, getUserColumnValue, isAdmin } = require("@library/common");
const {CustomerCollection} = require("@resources/superadmin/CustomerCollection");
const userModel = db.users;
const RoleModel = db.roles;
const stateModel = db.states;
const districtModel = db.districts;
const countryModel = db.countries;
const AddressModel = db.addresses;

/**
 * Retrieve all employee
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, all, role_id } = req.query;
  let conditions = {role_id: getRoleId('customer')};
  if(isDistributor(req)){
    let district_id = await getUserColumnValue(req.userId, 'district_id');
    conditions.district_id = district_id;
  }else if(isAdmin(req)){
    let state_id = await getUserColumnValue(req.userId, 'state_id');
    conditions.state_id = state_id;
  }

  const paginatorOptions = getPaginationOptions(page, limit);
  userModel.findAndCountAll({ 
    where: conditions,
    order:[['id', 'DESC']],
    offset: paginatorOptions.offset,
    limit: paginatorOptions.limit,
    include: [
      {
        model: districtModel,
        as: 'district',
      },
      {
        model: stateModel,
        as: 'state',
      },
      {
        model: countryModel,
        as: 'country',
      }
    ]
  }).then(async (data) => {
    let result = {
      items: CustomerCollection(data.rows),
      total: data.count,
    }
    res.send(formatResponse(result, 'All customers'));
  })
  .catch(err => { 
    res.status(errorCodes.default).send(formatErrorResponse(errorCodes.defaultErrorMsg));
  });
};

/**
 * View customer
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.fetch = async (req, res) => {
  let roleId = getRoleId('customer');;
  let user = await userModel.findOne({ where: { id: req.params.id, role_id: roleId}, 
    include: [
      {
        model: districtModel,
        as: 'district',
      },
      {
        model: stateModel,
        as: 'state',
      },
      {
        model: countryModel,
        as: 'country',
      }
     ]
   });
  if (!user) {
    return res.status(errorCodes.default).send(formatErrorResponse('customer not found'));
  }
  res.send(formatResponse(CustomerCollection(user), "customer fetched successfully!"));
};
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const { getPaginationOptions } = require('@helpers/paginator');
const { base64FileUpload, removeFile } = require('@helpers/upload');
const { isEmpty } = require("@helpers/helper");
const db = require("@models");
const { Op } = require("sequelize");
const { getRoleId, getCustomRoleIds } = require("@library/common");
const {EmployeeCollection} = require("@resources/superadmin/EmployeeCollection");
const userModel = db.users;
const RoleModel = db.roles;
const stateModel = db.states;
const districtModel = db.districts;
const countryModel = db.countries;

var bcrypt = require("bcryptjs");

/**
 * Retrieve all employee
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, all, role_id } = req.query;
  let conditions = {role_id: getRoleId('customer')};

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
      items: EmployeeCollection(data.rows),
      total: data.count,
    }
    res.send(formatResponse(result, 'All customers'));
  })
  .catch(err => { 
    res.status(errorCodes.default).send(formatErrorResponse(errorCodes.defaultErrorMsg));
  });
};
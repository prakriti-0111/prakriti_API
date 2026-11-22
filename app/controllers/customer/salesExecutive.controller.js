const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { Op } = require("sequelize");
const { getUserColumnValue, isSalesExecutive, isRetailer, orderHandlingAdminId, getAdminTeamUserIds } = require("@library/common");
const {EmployeeCollection} = require("@resources/superadmin/EmployeeCollection");
const userModel = db.users;
const RoleModel = db.roles;
const stateModel = db.states;
const districtModel = db.districts;
const countryModel = db.countries;


/**
 * Retrieve all employee
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let conditions = {role_id: 4};
  /* a retailer picks from every SE under its admin (its SE's admin); without
     one, the SEs of its district */
  let teamIds = null;
  if (isRetailer(req)) {
    const adminId = await orderHandlingAdminId({ user_id: req.userId });
    if (adminId) {
      teamIds = (await getAdminTeamUserIds(adminId)).filter((id) => id !== adminId);
    }
  }
  if (teamIds && teamIds.length) {
    conditions.id = { [Op.in]: teamIds };
  } else {
    conditions.district_id = await getUserColumnValue(req.userId, 'district_id');
  }
  if(isSalesExecutive(req)){
    conditions.id = {[Op.ne]: req.userId };
  }

  userModel.findAll({ 
    where: conditions,
    order:[['id', 'DESC']],
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
      },
      {
        model: RoleModel,
        as: 'role'
      }
    ]
  }).then(async (data) => {
    let result = {
      items: EmployeeCollection(data),
      total: data.length,
    }
    res.send(formatResponse(result, 'All sales executive'));
  })
  .catch(err => { 
    res.status(errorCodes.default).send(formatErrorResponse(errorCodes.defaultErrorMsg));
  });
};

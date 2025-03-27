const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const { getPaginationOptions } = require('@helpers/paginator');
const { base64FileUpload, removeFile, filterFilesFromRemove } = require('@helpers/upload');
const { isEmpty, isArray, priceFormat } = require("@helpers/helper");
const db = require("@models");
const moment = require('moment');
const { Op } = require("sequelize");
const { getRoleId, getNextUserName, isSuperAdmin, isAdmin, getUserColumnValue, getWorkingUserID, isSalesExecutive, getMyRetailerIds, insertVisit} = require("@library/common");
const {RetailerVisitCollection} = require("@resources/superadmin/RetailerVisitCollection");
const userModel = db.users;
const stateModel = db.states;
const districtModel = db.districts;
const countryModel = db.countries;
const SaleModel = db.sales;
const UserToUserModel = db.user_to_users;
const RetailerVisitModel = db.retailer_visits;


/**
 * Retrieve all visits
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, visit_user_id, user_id } = req.query;
  let conditions = {visit_user_id: visit_user_id};
  if(!isEmpty(user_id)){
    conditions.user_id = user_id;
  }else{
    conditions.user_id = req.userId;
  }
  const paginatorOptions = getPaginationOptions(page, limit);
  RetailerVisitModel.findAndCountAll({ 
    order:[['id', 'DESC']],
    offset: paginatorOptions.offset,
    limit: paginatorOptions.limit,
    where: conditions,
    include: [
      {
        model: userModel,
        as: 'user'
      },
      {
        model: userModel,
        as: 'retailer'
      }
    ]
  }).then(async (data) => {
    let result = {
      items: RetailerVisitCollection(data.rows),
      total: data.count,
    }
    res.send(formatResponse(result));
  })
  .catch(err => {
    res.status(errorCodes.default).send(formatErrorResponse(err));
  });
}

/**
 * Create Retailer Visit
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
  try {
    let data = req.body;

    let postData = {
      user_id: req.userId,
      visit_user_id: data.user_id,
      type: data.type,
      date: data.date ? moment(data.date).format('YYYY-MM-DD') : null,
      notes: data.notes || null
    }

    await insertVisit(postData);

    res.send(formatResponse("", "Created successfully!"));

  } catch (error) {
    res.status(errorCodes.default).send(formatErrorResponse(error.toString()));
  }


};

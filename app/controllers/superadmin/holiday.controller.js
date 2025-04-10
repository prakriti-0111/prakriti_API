const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { Op } = require("sequelize");
const moment = require('moment');
const sequelize = db.sequelize;
const { getPaginationOptions } = require('@helpers/paginator')
const { isEmpty } = require("@helpers/helper");
const {HolidayCollection} = require("@resources/superadmin/HolidayCollection");
const HolidayModel = db.holidays;

/**
 * Retrieve all holidays
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, all, search, year } = req.query;
  let conditions = {};
  if(!isEmpty(year)){
    conditions = sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year)
  }
  const paginatorOptions = getPaginationOptions(page, limit);
  HolidayModel.findAndCountAll({ 
    order:[['date', 'DESC']],
    offset: paginatorOptions.offset,
    limit: paginatorOptions.limit,
    where: conditions
  }).then(async (data) => {
    let result = {
      items: HolidayCollection(data.rows),
      total: data.count,
    }
    res.send(formatResponse(result, 'holidays'));
  })
  .catch(err => {
    res.status(errorCodes.default).send(formatErrorResponse(err));
  });
}

/**
 * Create holiday
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
  let data = req.body;

  const postData = {
    name: data.name,
    date: moment(data.date).format('YYYY-MM-DD')
  };

  HolidayModel.create(postData).then(result => {
    res.send(formatResponse('', "Holiday created successfully!"));
  }).catch(error => {
    return res.status(errorCodes.default).send(formatErrorResponse(error.toString()));
  }); 
};


/**
 * View holiday
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.fetch = async (req, res) => {
  let holiday = await HolidayModel.findOne({ where: { id: req.params.id } });
  if (!holiday) {
    return res.status(errorCodes.default).send(formatErrorResponse('Holiday not found'));
  }
  res.send(formatResponse(HolidayCollection(holiday)));
};



/**
 * Update holiday
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.update = async (req, res) => {
  let data = req.body;
  let holiday = await HolidayModel.findOne({ where: { id: req.params.id } });
  if (!holiday) {
    return res.status(errorCodes.default).send(formatErrorResponse('Holiday not found'));
  }
  const postData = {
    name: data.name,
    date: moment(data.date).format('YYYY-MM-DD')
  };

  HolidayModel.update(postData, { where: { id: req.params.id } }).then(result => {
    res.send(formatResponse('', "Holiday updated successfully!"));
  }).catch(error => {
    return res.status(errorCodes.default).send(formatErrorResponse(errorCodes.defaultErrorMsg));
  });
};



  
/**
 * delete holiday
 * 
 * @param {*} req
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  HolidayModel.destroy({ where: { id: req.params.id } }).then(result => {
    res.send(formatResponse("", 'Holiday deleted successfully!'));
  }).catch(error => {
    return res.status(errorCodes.default).send(formatErrorResponse(errorCodes.defaultErrorMsg));
  });
};
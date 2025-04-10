const config = require("@config/auth.config");
const { isEmpty } = require("@helpers/helper");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { Op } = require("sequelize");
const { getPaginationOptions } = require('@helpers/paginator')
const sequelize = db.sequelize;
const ReasonModel = db.reasons;
const moment = require('moment');

/**
 * Retrieve all Reasons
 * @param req
 * @param res
 */

exports.index = async (req, res) => {
  ReasonModel.findAll({
    attributes:['id', 'name'],
    }).then(async (data) => {
      res.send(formatResponse(data, 'Expense fetched successfully!'));
   });   
};



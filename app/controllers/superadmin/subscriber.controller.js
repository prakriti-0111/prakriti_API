const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { isEmpty } = require("@helpers/helper");
const { Op } = require("sequelize");
const { getPaginationOptions } = require('@helpers/paginator')
const { SubscriberCollection } = require("@resources/superadmin/SubscriberCollection");
const SubscriberModel = db.subscribers;

/**
 * 
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, all, search } = req.query;
  let conditions = {};
  if (!isEmpty(search)) {
    conditions = {...conditions, [Op.or]: [{name: { [Op.like]: `%${search}%` }}, {email: { [Op.like]: `%${search}%` }}, {mobile: { [Op.like]: `%${search}%` }}]};
  }
  const paginatorOptions = getPaginationOptions(page, limit);
  SubscriberModel.findAndCountAll({
    order: [['id', 'DESC']],
    offset: paginatorOptions.offset,
    limit: paginatorOptions.limit,
    where: conditions
  }).then(async (data) => {
    let result = {
      items: SubscriberCollection(data.rows),
      total: data.count,
    }
    res.send(formatResponse(result));
  })
    .catch(err => {
      res.status(errorCodes.default).send(formatErrorResponse());
    });
}

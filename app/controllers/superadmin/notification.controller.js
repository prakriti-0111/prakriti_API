const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const { getPaginationOptions } = require('@helpers/paginator');
const db = require("@models");
const { isEmpty } = require("@helpers/helper");
const { Op } = require("sequelize");
const {NotificationCollection} = require("@resources/superadmin/NotificationCollection");
const {getWorkingUserID, convertToNotificationGroup, isManager} = require("@library/common");
const NoticationModel = db.notifiactions;

/**
 * Retrieve all Notifications
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit } = req.query;
  let userID = isManager(req) ? req.userId : await getWorkingUserID(req);
  const paginatorOptions = getPaginationOptions(page, limit);
  NoticationModel.findAndCountAll({ 
    order:[['id', 'DESC']],
    //offset: paginatorOptions.offset,
    //limit: paginatorOptions.limit,
    where: {user_id: userID, is_read: false}
  }).then(async (data) => {
    let totalNew = await NoticationModel.count({where: {user_id: userID, is_read: false}});
    let result = {
      items: convertToNotificationGroup(NotificationCollection(data.rows)),
      total: data.count,
      new: totalNew
    }
    res.send(formatResponse(result, 'Notifications'));
  })
  .catch(err => {
    res.status(errorCodes.default).send(formatErrorResponse(err));
  });
}

/**
 * Retrieve all Notifications
 * @param req
 * @param res
 */
exports.updateRead = async (req, res) => {
  NoticationModel.update({is_read: true}, { where: { id: req.params.id } }).then(result => {
    res.send(formatResponse(""));
  });
}




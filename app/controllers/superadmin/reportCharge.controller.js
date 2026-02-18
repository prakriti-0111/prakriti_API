const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const { getPaginationOptions } = require('@helpers/paginator');
const db = require("@models");
const { Op } = require("sequelize");
const { isEmpty } = require("@helpers/helper");
const {ReportChargeCollection} = require("@resources/superadmin/ReportChargeCollection");
const ReportChargeModel = db.report_charge;

/**
 * Retrieve Report Charge
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
    let { page, limit, all, search } = req.query;
    let conditions = {};
    if(!isEmpty(search)){
      conditions.amount = {[Op.like]: `%${search}%` };
    }
    //if(all == 1){
      ReportChargeModel.findAll({ 
        order:[['amount', 'ASC']],
        where: conditions
      }).then(async (data) => {
        let result = {
          items: await ReportChargeCollection(data),
          total: data.length
        }
        res.send(formatResponse(result, 'Report Charge'));
      })
      .catch(err => {
        res.status(errorCodes.default).send(formatErrorResponse(err));
      });
}



/**
 * Update Report Charge
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.update = async (req, res) => {
    let data = req.body;
    let size = await ReportChargeModel.findOne({ where: { id: req.params.id} });
    /* if (!size) {
      return res.status(errorCodes.default).send(formatErrorResponse('Report Charge not found'));
    } */
    const postData = {
      amount: data.amount != ""?parseFloat(data.amount).toFixed(2):"",
      tax: data.tax != ""?parseFloat(data.tax).toFixed(2):""
    };
    if (!size) {
      ReportChargeModel.insert(postData, { where: { } }).then(async(result) => {
        res.send(formatResponse(await ReportChargeCollection(data), "Report Charge updated successfully!"));
      }).catch(error => {
        return res.status(errorCodes.default).send(formatErrorResponse('Report Charge does not updated due to some error' + error));
      });
    } else {
      ReportChargeModel.update(postData, { where: { id: req.params.id} }).then(async(result) => {
        res.send(formatResponse(await ReportChargeCollection(data), "Report Charge updated successfully!"));
      }).catch(error => {
        return res.status(errorCodes.default).send(formatErrorResponse('Report Charge does not updated due to some error' + error));
      });
    }
};
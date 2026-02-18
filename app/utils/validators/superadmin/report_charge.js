const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Update Report Charge
 *
 * @param req
 * @param res
 * @param next
 */
const ReportChargeUpdate = (req, res, next) => {
    const validationRule = {
      "amount": "required|numeric",
      "tax": "required|numeric"
    }
    validator(req.body, validationRule, {}, (err, status) => {
      if (!status) {
        res.status(errorCodes.default).send(formatValidationResponse(err));
      } else {
        next();
      }
    });
}

module.exports = {
    ReportChargeUpdate
}
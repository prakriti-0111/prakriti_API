const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate change Password
 *
 * @param req
 * @param res
 * @param next
 */
const priceInfo = (req, res, next) => {
  const validationRule = {
    "stock_id": "required|integer",
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
  priceInfo
}
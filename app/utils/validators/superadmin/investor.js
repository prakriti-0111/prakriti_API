const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Store Investor
 *
 * @param req
 * @param res
 * @param next
 */
const InvestorCreate = (req, res, next) => {
  const validationRule = {
    //"district_id": "integer",
    //"state_id": "integer",
    //"country_id": "integer",
    "name": "required|string|max:255",
    //"email": "required|email|string|max:255",
    "mobile": "required|integer|digits:10",
    //"pincode": "integer",
   // "alternative_no": "integer|digits:10",
  }
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(errorCodes.default).send(formatValidationResponse(err));
    } else {
      next();
    }
  });
}

/**
 * Validate Update Investor
 *
 * @param req
 * @param res
 * @param next
 */
 const InvestorUpdate = (req, res, next) => {
  const validationRule = {
    //"district_id": "integer",
    //"state_id": "integer",
    //"country_id": "integer",
    "name": "required|string|max:255",
    //"email": "required|email|string|max:255",
    "mobile": "required|integer|digits:10",
    //"pincode": "integer",
    //"alternative_no": "integer|digits:10",
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
  InvestorCreate,
  InvestorUpdate
}
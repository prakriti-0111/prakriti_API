const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Store Retailer
 *
 * @param req
 * @param res
 * @param next
 */
const RetailerCreate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:255",
    "password": "required|string|max:255",
    //"email": "required|email|string|max:255",
    "mobile": "required|integer|digits:10",
    //"district_id": "integer",
    //"state_id": "integer",
    //"country_id": "integer",
    //"pincode": "integer",
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
 * Validate Update Retailer
 *
 * @param req
 * @param res
 * @param next
 */
 const RetailerUpdate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:255",
    //"password": "string|max:255",
    //"email": "required|email|string|max:255",
    "mobile": "required|integer|digits:10",
    //"district_id": "integer",
    //"state_id": "integer",
   // "country_id": "integer",
    //"pincode": "integer",
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
  RetailerCreate,
  RetailerUpdate
}
const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Store Distributor
 *
 * @param req
 * @param res
 * @param next
 */
const DistributorCreate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:255",
    "password": "required|string|max:255",
    //"email": "required|email|string|max:255",
    "mobile": "required|integer|digits:10",
    "district_id": "required|integer",
    "state_id": "required|integer",
    "country_id": "required|integer",
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
 * Validate Update Distributor
 *
 * @param req
 * @param res
 * @param next
 */
 const DistributorUpdate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:255",
    "password": "string|max:255",
    //"email": "required|email|string|max:255",
    "mobile": "required|integer|digits:10",
    "district_id": "required|integer",
    "state_id": "required|integer",
    "country_id": "required|integer",
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
  DistributorCreate,
  DistributorUpdate
}
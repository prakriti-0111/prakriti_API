const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Store Supplier
 *
 * @param req
 * @param res
 * @param next
 */
const SupplierCreate = (req, res, next) => {
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
 * Validate Update Supplier
 *
 * @param req
 * @param res
 * @param next
 */
 const SupplierUpdate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:255",
    //"password": "string|max:255",
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



module.exports = {
  SupplierCreate,
  SupplierUpdate
}
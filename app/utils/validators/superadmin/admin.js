const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Store Admin
 *
 * @param req
 * @param res
 * @param next
 */
const AdminCreate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:255",
    "password": "required|string|max:255",
    //"email": "required|email|string|max:255",
    "mobile": "required|integer|digits:10",
    //"district_id": "integer",
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
 * Validate Update Admin
 *
 * @param req
 * @param res
 * @param next
 */
 const AdminUpdate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:255",
    //"password": "string|max:255",
    //"email": "required|email|string|max:255",
    "mobile": "required|integer|digits:10",
    //"district_id": "integer",
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
  AdminCreate,
  AdminUpdate
}
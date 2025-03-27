const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Store District
 *
 * @param req
 * @param res
 * @param next
 */
const DistrictCreate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:50",
    "country_id": "required|integer",
    "state_id": "required|integer"
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
 * Validate Update District
 *
 * @param req
 * @param res
 * @param next
 */
 const DistrictUpdate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:50",
    "country_id": "required|integer",
    "state_id": "required|integer"
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
  DistrictCreate,
  DistrictUpdate
}
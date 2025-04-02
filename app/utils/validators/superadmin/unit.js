const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Store Country
 *
 * @param req
 * @param res
 * @param next
 */
const UnitCreate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:50"
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
 * Validate Update Country
 *
 * @param req
 * @param res
 * @param next
 */
 const UnitUpdate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:50"
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
  UnitCreate,
  UnitUpdate
}
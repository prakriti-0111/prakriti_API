const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Store State
 *
 * @param req
 * @param res
 * @param next
 */
const StateCreate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:50",
    "country_id": "required|integer"
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
 * Validate Update State
 *
 * @param req
 * @param res
 * @param next
 */
 const StateUpdate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:50",
    "country_id": "required|integer"
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
  StateCreate,
  StateUpdate
}
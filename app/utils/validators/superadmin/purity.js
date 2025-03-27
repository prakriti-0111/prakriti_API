const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Store Purity
 *
 * @param req
 * @param res
 * @param next
 */
const PurityCreate = (req, res, next) => {
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
 * Validate Update Purity
 *
 * @param req
 * @param res
 * @param next
 */
 const PurityUpdate = (req, res, next) => {
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
  PurityCreate,
  PurityUpdate
}
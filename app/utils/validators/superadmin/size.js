const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Store Size
 *
 * @param req
 * @param res
 * @param next
 */
const SizeCreate = (req, res, next) => {
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
 * Validate Update Size
 *
 * @param req
 * @param res
 * @param next
 */
 const SizeUpdate = (req, res, next) => {
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
  SizeCreate,
  SizeUpdate
}
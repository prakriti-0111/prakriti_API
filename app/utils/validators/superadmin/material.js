const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Store Material
 *
 * @param req
 * @param res
 * @param next
 */
const MaterialCreate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:50",
    "category_id": "required|integer",
    "unit_id": "required",
    "purities": "required",
    "status": "integer"
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
 * Validate Update Material
 *
 * @param req
 * @param res
 * @param next
 */
 const MaterialUpdate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:50",
    "category_id": "required|integer",
    "unit_id": "required",
    "purities": "required",
    "status": "integer"
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
    MaterialCreate,
    MaterialUpdate
}
const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Store Country
 *
 * @param req
 * @param res
 * @param next
 */
const TaxCreate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:50",
    "cgst": "required|numeric",
    "sgst": "required|numeric",
    "igst": "required|numeric",
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
 const TaxUpdate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:50",
    "cgst": "required|numeric",
    "sgst": "required|numeric",
    "igst": "required|numeric",
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
  TaxCreate,
  TaxUpdate
}
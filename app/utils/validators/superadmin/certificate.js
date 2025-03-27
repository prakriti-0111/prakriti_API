const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Store Country
 *
 * @param req
 * @param res
 * @param next
 */
const CertificateCreate = (req, res, next) => {
  const validationRule = {
    "name": "required|string",
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
 * Validate Update Country
 *
 * @param req
 * @param res
 * @param next
 */
 const CertificateUpdate = (req, res, next) => {
  const validationRule = {
    "name": "required|string",
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
    CertificateCreate,
    CertificateUpdate
}
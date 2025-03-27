const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Store Permission
 *
 * @param req
 * @param res
 * @param next
 */
const PermissionCreate = (req, res, next) => {
  const validationRule = {
    "role_id": "required|integer",
    "view": "required",
    "add": "required",
    "edit": "required",
    "delete": "required",
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
  PermissionCreate
}
const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Store Permission
 *
 * @param req
 * @param res
 * @param next
 */
const LeaveApplicationCreate = (req, res, next) => {
  const validationRule = {
    "user_id": "required|integer"
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
 * Validate Update Permission
 *
 * @param req
 * @param res
 * @param next
 */
 const LeaveApplicationUpdate = (req, res, next) => {
  const validationRule = {
    "user_id": "required|integer"
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
    LeaveApplicationCreate,
    LeaveApplicationUpdate
}
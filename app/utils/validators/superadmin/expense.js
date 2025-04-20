const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Store Expense
 *
 * @param req
 * @param res
 * @param next
 */
const ExpenseCreate = (req, res, next) => {
  const validationRule = {
    "reason_id": "required|integer",
    "date": "required",
    //"description": "required",
    //"bill_image": "required",
    "amount": "required|numeric",
    //"explanation": "required", 
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
 * Validate Update Expense
 *
 * @param req
 * @param res
 * @param next
 */
 const ExpenseUpdate = (req, res, next) => {
  const validationRule = {
    "reason_id": "required|integer",
    "date": "required",
    //"description": "required",
    //"bill_image": "required",
    "amount": "required|numeric",
    //"explanation": "required", 
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
    ExpenseCreate,
    ExpenseUpdate
}
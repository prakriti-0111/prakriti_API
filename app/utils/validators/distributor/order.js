const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Order Place
 *
 * @param req
 * @param res
 * @param next
 */
const OrderPlace = (req, res, next) => {
  const validationRule = {
    //"delivery_address": "required|string|max:255",
    "payment_mode": "required|string|max:20",
    "sub_total": "required:numeric",
    "discount_amount": "numeric",
    "total_amount": "required:numeric",
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
 * Validate Order Cancel
 *
 * @param req
 * @param res
 * @param next
 */
 const OrderCancel = (req, res, next) => {
  const validationRule = {
    "order_id": "required:integer",
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
  OrderPlace,
  OrderCancel
}
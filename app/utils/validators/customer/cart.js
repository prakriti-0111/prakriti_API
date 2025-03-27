const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Store Cart
 *
 * @param req
 * @param res
 * @param next
 */
const CartCreate = (req, res, next) => {
  const validationRule = {   
    "product_id": "required|integer",
    "type": "required|string",
    //"size_id": "integer",
    //"stock_id": "integer",
    "material_id": "integer",
    "purity_id": "integer",
    "weight": "numeric",
    "quantity": "integer",
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
 * Validate Update Cart
 *
 * @param req
 * @param res
 * @param next
 */
const CartUpdate = (req, res, next) => {
  const validationRule = {
    //"product_id": "required|integer",
    //"type": "required|string",
    //"size_id": "integer",
    //"stock_id": "integer",
    //"material_id": "integer",
    //"purity_id": "integer",
    //"weight": "numeric",
    "quantity": "integer",
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
  CartCreate,
  CartUpdate
}
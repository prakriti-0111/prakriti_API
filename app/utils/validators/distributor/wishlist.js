const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Update Wishlist
 *
 * @param req
 * @param res
 * @param next
 */
const updateWishlist = (req, res, next) => {
  const validationRule = {   
    "product_id": "required|integer",
    "size_id": "integer",
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
  updateWishlist
}
const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Store Subcategory
 *
 * @param req
 * @param res
 * @param next
 */
const SubcategoryCreate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:50",
    "category_id": "required|integer",
    //"making_charge_type": "required|string",
    //"making_charge": "required|numeric",
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
 * Validate Update Subcategory
 *
 * @param req
 * @param res
 * @param next
 */
 const SubcategoryUpdate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:50",
    "category_id": "required|integer",
    //"making_charge_type": "required|string",
    //"making_charge": "required|numeric",
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
    SubcategoryCreate,
    SubcategoryUpdate
}
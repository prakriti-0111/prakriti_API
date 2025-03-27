const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Store Address
 *
 * @param req
 * @param res
 * @param next
 */
const AddressCreate = (req, res, next) => {
  const validationRule = {
    "user_id": "integer",
    "type": "required|string|max:50",
    "name": "required|string|max:50",
    "street": "required|string",
    "landmark": "required|string",
    "city": "required|string|max:50",
    "state": "required|string|max:50",
    "zipcode": "required|string|max:15",
    "country": "required|string|max:50",
    "contact": "required|integer|digits:10",
    "lat": "numeric",
    "lng": "numeric",
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
 * Validate Update Address
 *
 * @param req
 * @param res
 * @param next
 */
 const AddressUpdate = (req, res, next) => {
  const validationRule = {
    "user_id": "integer",
    "type": "required|string|max:50",
    "name": "required|string|max:50",
    "street": "required|string",
    "landmark": "required|string",
    "city": "required|string|max:50",
    "state": "required|string|max:50",
    "zipcode": "required|string|max:15",
    "country": "required|string|max:50",
    "contact": "required|integer|digits:10",
    "lat": "numeric",
    "lng": "numeric",
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
    AddressCreate,
    AddressUpdate
}
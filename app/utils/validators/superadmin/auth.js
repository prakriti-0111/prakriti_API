const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate signIn
 *
 * @param req
 * @param res
 * @param next
 */
const signIn = (req, res, next) => {
  const validationRule = {
    "mobile": "required|string|max:255",
    "password": "required|string|min:4|max:255"
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
  signIn
}
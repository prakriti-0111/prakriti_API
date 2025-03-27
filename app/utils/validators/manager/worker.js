const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Store Worker
 *
 * @param req
 * @param res
 * @param next
 */
const WorkerCreate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:255",
    //"email": "required|email|string|max:255",
    "mobile": "required|integer|digits:10",
    //"parent_id": "integer",
   
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
 * Validate Update Worker
 *
 * @param req
 * @param res
 * @param next
 */
 const WorkerUpdate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:255",
    //"email": "required|email|string|max:255",
    "mobile": "required|integer|digits:10",
    //"parent_id": "integer",
  
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
  WorkerCreate,
  WorkerUpdate
}
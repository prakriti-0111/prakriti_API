const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");


/**
 * Validate Store Employee
 *
 * @param req
 * @param res
 * @param next
 */
const EmployeeCreate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:255",
    //"password": "required|string|max:255",
    //"email": "required|email|string|max:255",
    "mobile": "required|integer|digits:10",
    "role_id": "required",
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
 * Validate Update Employee
 *
 * @param req
 * @param res
 * @param next
 */
 const EmployeeUpdate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:255",
    //"password": "string|max:255",
    //"email": "required|email|string|max:255",
    "mobile": "required|integer|digits:10",
    "role_id": "required"
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
 * Validate Store Salary 
 *
 * @param req
 * @param res
 * @param next
 */
 const SalaryCreate = (req, res, next) => {
  const validationRule = {
    "role_id": "required|integer",
    "user_id": "required|integer",
    "gross_salary": "required|numeric",
    "basic_salary": "required|numeric",
    "eff_date": "required",
    "is_epf": "required|integer",
    "is_medical": "required|integer",
    "target": "required|integer",
    "visit_target": "required|integer",
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
 * Validate Update Salary 
 *
 * @param req
 * @param res
 * @param next
 */
 const SalaryUpdate = (req, res, next) => {
  const validationRule = {
    "role_id": "required|integer",
    "user_id": "required|integer",
    "gross_salary": "required|numeric",
    "basic_salary": "required|numeric",
    "eff_date": "required",
    "is_epf": "required|integer",
    "is_medical": "required|integer",
    "target": "required|integer",
    "visit_target": "required|integer",
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
  EmployeeCreate,
  EmployeeUpdate,
  SalaryCreate,
  SalaryUpdate
}
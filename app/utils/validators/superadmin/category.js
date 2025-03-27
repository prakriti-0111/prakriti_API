const validator = require('@helpers/validate');
const { errorCodes, formatValidationResponse } = require("@utils/response.config");
const { Op } = require("sequelize");
const db = require("@models");
const CategoryModel = db.categories;


/**
 * Validate Store Category
 *
 * @param req
 * @param res
 * @param next
 */
const CategoryCreate = (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:50|unique:categories,name",
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
 * Validate Update Category
 *
 * @param req
 * @param res
 * @param next
 */
 const CategoryUpdate = async (req, res, next) => {
  const validationRule = {
    "name": "required|string|max:50",
    "status": "integer"
  }
  validator(req.body, validationRule, {}, async (err, status) => {
    if (!status) {
      res.status(errorCodes.default).send(formatValidationResponse(err));
    } else {
      let id = req.params.id;
      let category = await CategoryModel.findOne({where:{name: req.body.name, id:{ [Op.not]: id }}});
      if(category){
        return res.status(errorCodes.default).send(formatValidationResponse({errors: "Name already in use."}, true));
      }

      next();
    }
  });
}



module.exports = {
    CategoryCreate,
    CategoryUpdate
}
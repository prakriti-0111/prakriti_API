const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { Op } = require("sequelize");
const { getPaginationOptions } = require('@helpers/paginator')
const { convertToSlug, isEmpty } = require("@helpers/helper");
const {ReturnPolicyCollection} = require("@resources/superadmin/ReturnPolicyCollection");
const ReturnPolicyModel = db.return_policy;
const CategoryModel = db.categories;

/**
 * Retrieve all Return Policy
 * 
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, category_id, role } = req.query;
  let conditions = {};
  if(!isEmpty(category_id)){
    conditions.category_id = category_id;
  }
  if(!isEmpty(role)){
    conditions.role = role;
  }
  
  const paginatorOptions = getPaginationOptions(page, limit);
  ReturnPolicyModel.findAndCountAll({ 
    order:[['id', 'DESC']],
    where: conditions,
    offset: paginatorOptions.offset,
    limit: paginatorOptions.limit,
    include: [
      {
        model: CategoryModel,
        as: 'category',
      }
    ] 
  }).then(async (data) => {
    let result = {
      items: ReturnPolicyCollection(data.rows),
      total: data.count,
    }
    res.send(formatResponse(result));
  })
  .catch(err => {
    res.status(errorCodes.default).send(formatErrorResponse(err));
  });
};

/**
 * Create Return Policy
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
  let data = req.body;
  
  //make unique
  let returnPolicy = await ReturnPolicyModel.findOne({where: {role: data.role, category_id: data.category_id}});
  if(returnPolicy){
    return res.status(errorCodes.default).send(formatErrorResponse('Return Policy is already exists by this role & category.'));
  }

  const postData = {
    category_id: data.category_id,
    role: data.role,
    amount: data.amount,
    days: data.days
  };

  ReturnPolicyModel.create(postData).then(result => {
    res.send(formatResponse("", "Return policy created successfully!"));
  }).catch(error => {
    return res.status(errorCodes.default).send(formatErrorResponse(errorCodes.defaultErrorMsg));
  }); 
};


/**
 * View Return Policy
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.fetch = async (req, res) => {
  let returnPolicy = await ReturnPolicyModel.findOne({ where: { id: req.params.id },
    include: [
      {
        model: CategoryModel,
        as: 'category',
      }
  ] });
  if (!returnPolicy) {
    return res.status(errorCodes.default).send(formatErrorResponse('Not found'));
  }
  res.send(formatResponse(ReturnPolicyCollection(returnPolicy)));
};



/**
 * Update Return Policy
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.update = async (req, res) => {
  let data = req.body;
  let returnPolicy = await ReturnPolicyModel.findOne({ where: { id: req.params.id } });
  if (!returnPolicy) {
    return res.status(errorCodes.default).send(formatErrorResponse('Not found'));
  }

  //make unique
  let hasReturnPolicy = await ReturnPolicyModel.findOne({where: {role: data.role, category_id: data.category_id, id:{ [Op.not]: req.params.id }}});
  if(hasReturnPolicy){
    return res.status(errorCodes.default).send(formatErrorResponse('Return Policy is already exists by this role & category.'));
  }

  const postData = {
    category_id: data.category_id,
    role: data.role,
    amount: data.amount,
    days: data.days
  };
  ReturnPolicyModel.update(postData, { where: { id: req.params.id } }).then(result => {
    res.send(formatResponse("", "Updated successfully!"));
  }).catch(error => {
    return res.status(errorCodes.default).send(formatErrorResponse(errorCodes.defaultErrorMsg));
  });
};



  
/**
 * delete Return Policy
 * 
 * @param {*} req
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  ReturnPolicyModel.destroy({ where: { id: req.params.id } }).then(result => {
    res.send(formatResponse("", 'Deleted Successfully!'));
  }).catch(error => {
    return res.status(errorCodes.default).send(formatErrorResponse(errorCodes.defaultErrorMsg));
  });
};
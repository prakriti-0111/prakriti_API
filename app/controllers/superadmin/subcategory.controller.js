const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { Op } = require("sequelize");
const { getPaginationOptions } = require('@helpers/paginator')
const { convertToSlug, isEmpty } = require("@helpers/helper");
const {SubCategoryCollection} = require("@resources/superadmin/SubCategoryCollection");
const SubCategoryModel = db.sub_categories;
const CategoryModel = db.categories;
const productsModel = db.products;

/**
 * Retrieve all Sub categories
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, category_id, all, search } = req.query;
  let conditions = {};
  if(!isEmpty(category_id)){
    conditions.category_id = category_id;
  }
  if(!isEmpty(search)){
    conditions.name = {[Op.like]: `%${search}%` };
  }
  if(all == 1){
    SubCategoryModel.findAll({ 
      order:[['name', 'ASC']],
      where: conditions,
      include: [
        {
          model: CategoryModel,
          as: 'category',
        }
      ] 
    }).then(async (data) => {
      let result = {
        items: SubCategoryCollection(data),
        total: data.length
      }
      res.send(formatResponse(result, 'Sub Categories'));
    })
    .catch(err => {
      res.status(errorCodes.default).send(formatErrorResponse(err));
    });
  }else{
    const paginatorOptions = getPaginationOptions(page, limit);
    SubCategoryModel.findAndCountAll({ 
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
          items: SubCategoryCollection(data.rows),
          total: data.count,
        }
        res.send(formatResponse(result, 'Sub Categories'));
      })
      .catch(err => {
        res.status(errorCodes.default).send(formatErrorResponse(err));
      });

  }
};

/**
 * Create Sub Category
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
  let data = req.body;
  
    //make unique
    let subCategoryExistsByName = await SubCategoryModel.findOne({where: {name: data.name, category_id: data.category_id}});
    if(subCategoryExistsByName){
      return res.status(errorCodes.default).send(formatErrorResponse('Name already in use.'));
    }

    //make unique
    let subCategoryExistsByHSN = await SubCategoryModel.findOne({where: {hsn_code: data.hsn_code, category_id: data.category_id}});
    if(subCategoryExistsByHSN){
      return res.status(errorCodes.default).send(formatErrorResponse('HSN code already in use.'));
    }

    const postData = {
      category_id: data.category_id,
      name: data.name,
      slug: convertToSlug(data.name),
      hsn_code: data.hsn_code,
      admin_discount: !isEmpty(data.admin_discount) ? data.admin_discount : null,
      distributor_discount: !isEmpty(data.distributor_discount) ? data.distributor_discount : null,
      retailer_discount: !isEmpty(data.retailer_discount) ? data.retailer_discount : null,
      customer_discount: !isEmpty(data.customer_discount) ? data.customer_discount : null,
      making_charge: !isEmpty(data.making_charge) ? data.making_charge : null,
      base_price: !isEmpty(data.base_price) ? data.base_price : null,
      increase: !isEmpty(data.increase) ? data.increase : null,
      making_charge_type: !isEmpty(data.making_charge_type) ? data.making_charge_type : '',
      status: data.status,
    };
  
    SubCategoryModel.create(postData).then(result => {
      res.send(formatResponse(SubCategoryCollection(result), "Sub category created successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('Sub category does not created due to some error' + error));
    }); 
};


/**
 * View Sub Category
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.fetch = async (req, res) => {
  let category = await SubCategoryModel.findOne({ where: { id: req.params.id },
    include: [
      {
        model: CategoryModel,
        as: 'category',
      }
  ] });
  if (!category) {
    return res.status(errorCodes.default).send(formatErrorResponse('Sub category not found'));
  }
  res.send(formatResponse(SubCategoryCollection(category), "Sub category fetched successfully!"));
};



/**
 * Update Sub Category
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.update = async (req, res) => {
    let data = req.body;
    let category = await SubCategoryModel.findOne({ where: { id: req.params.id } });
    if (!category) {
      return res.status(errorCodes.default).send(formatErrorResponse('Sub category not found'));
    }

    //make unique
    let subCategoryExistsWithName = await SubCategoryModel.findOne({where: {name: data.name, category_id: data.category_id, id:{ [Op.not]: req.params.id }}});
    if(subCategoryExistsWithName){
      return res.status(errorCodes.default).send(formatErrorResponse('Name already in use.'));
    }

    //make unique
    let subCategoryExistsWithHSN = await SubCategoryModel.findOne({where: {hsn_code: data.hsn_code, category_id: data.category_id, id:{ [Op.not]: req.params.id }}});
    if(subCategoryExistsWithHSN){
      return res.status(errorCodes.default).send(formatErrorResponse('HSN code already in use.'));
    }

    const postData = {
      category_id: data.category_id,
      name: data.name,
      slug: convertToSlug(data.name),
      hsn_code: data.hsn_code,
      admin_discount: !isEmpty(data.admin_discount) ? data.admin_discount : null,
      distributor_discount: !isEmpty(data.distributor_discount) ? data.distributor_discount : null,
      retailer_discount: !isEmpty(data.retailer_discount) ? data.retailer_discount : null,
      customer_discount: !isEmpty(data.customer_discount) ? data.customer_discount : null,
      making_charge: !isEmpty(data.making_charge) ? data.making_charge : null,
      base_price: !isEmpty(data.base_price) ? data.base_price : null,
      increase: !isEmpty(data.base_price) ? data.increase : null,
      making_charge_type: !isEmpty(data.making_charge_type) ? data.making_charge_type : '',
      status: data.status,
    };
    SubCategoryModel.update(postData, { where: { id: req.params.id } }).then(result => {
      res.send(formatResponse(SubCategoryCollection(data), "Sub category updated successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('Sub category does not updated due to some error' + error));
    });
};



  
/**
 * delete Sub Category
 * 
 * @param {*} req
 * @param {*} res 
 */
 exports.delete = async (req, res) => {
  let product = await productsModel.findOne({where: {sub_category_id: req.params.id}});
  if(product){
    return res.status(errorCodes.default).send(formatErrorResponse('This sub category is exists in product.'));
  }

  SubCategoryModel.destroy({ where: { id: req.params.id } }).then(result => {
    res.send(formatResponse("", 'Sub category deleted Successfully!'));
  }).catch(error => {
    return res.status(errorCodes.default).send(formatErrorResponse(error));
  });
};
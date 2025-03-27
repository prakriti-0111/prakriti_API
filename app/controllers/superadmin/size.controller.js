const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const { getPaginationOptions } = require('@helpers/paginator');
const db = require("@models");
const { Op } = require("sequelize");
const {SizeCollection} = require("@resources/superadmin/SizeCollection");
const { isEmpty } = require("@helpers/helper");
const SizeModel = db.sizes;
const CategoryModel = db.categories;
const SubCategoryModel = db.sub_categories;
const ProductSizeModel = db.product_sizes;

/**
 * Retrieve all sizes
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
    let { page, limit, all, sub_category_id, search } = req.query;
    let conditions = {};
    if(!isEmpty(sub_category_id)){
      conditions.sub_category_id = sub_category_id;
    }
    if(!isEmpty(search)){
      conditions.name = {[Op.like]: `%${search}%` };
    }

    if(all == 1){
      SizeModel.findAll({ 
        order:[['id', 'ASC']],
        where: conditions
      }).then(async (data) => {
        let result = {
          items: SizeCollection(data),
          total: data.length
        }
        res.send(formatResponse(result, 'Sizes'));
      })
      .catch(err => {
        res.status(errorCodes.default).send(formatErrorResponse(err));
      });
    }else{
      const paginatorOptions = getPaginationOptions(page, limit);
      SizeModel.findAndCountAll({ 
          order:[['id', 'DESC']],
          offset: paginatorOptions.offset,
          limit: paginatorOptions.limit,
          where: conditions,
          include: [
            {
              model: CategoryModel,
              as: 'category'
            },
            {
              model: SubCategoryModel,
              as: 'sub_category'
            }
          ]
        }).then(async (data) => {
          let result = {
            items: SizeCollection(data.rows),
            total: data.count,
          }
          res.send(formatResponse(result, 'Sizes'));
        })
        .catch(err => {
          res.status(errorCodes.default).send(formatErrorResponse(err));
        });
      };
    }
/**
 * Create Size
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
    let data = req.body;

    //make unique
    let size = await SizeModel.findOne({where: {name: data.name, sub_category_id: data.sub_category_id}});
    if(size){
      return res.status(errorCodes.default).send(formatErrorResponse('Name already in use.'));
    }

    let subcategory = await SubCategoryModel.findByPk(data.sub_category_id);
    const postData = {
      category_id: subcategory ? subcategory.category_id : null,
      sub_category_id: data.sub_category_id,
      name: data.name,
    };
  
    SizeModel.create(postData).then(result => {
      res.send(formatResponse(SizeCollection(result), "Size created successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('Size does not created due to some error' + error));
    }); 
};


/**
 * Update Size
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.update = async (req, res) => {
    let data = req.body;
    let size = await SizeModel.findOne({ where: { id: req.params.id} });
    if (!size) {
      return res.status(errorCodes.default).send(formatErrorResponse('Size not found'));
    }

    //make unique
    let hasSize = await SizeModel.findOne({where: {name: data.name, sub_category_id: data.sub_category_id, id:{ [Op.not]: req.params.id }}});
    if(hasSize){
      return res.status(errorCodes.default).send(formatErrorResponse('Name already in use.'));
    }

    let subcategory = await SubCategoryModel.findByPk(data.sub_category_id);
    const postData = {
      name: data.name,
      category_id: subcategory ? subcategory.category_id : null,
      sub_category_id: data.sub_category_id
    };
    SizeModel.update(postData, { where: { id: req.params.id} }).then(result => {
      res.send(formatResponse(SizeCollection(data), "Size updated successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('Size does not updated due to some error' + error));
    });
};


/**
 * View Size
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.fetch = async (req, res) => {
  let size = await SizeModel.findOne({ where: { id: req.params.id} });
  if (!size) {
    return res.status(errorCodes.default).send(formatErrorResponse('Size not found'));
  }
  res.send(formatResponse(SizeCollection(size), "Size fetched successfully!"));
};

  
/**
 * delete Size
 * 
 * @param {*} req
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  let product = await ProductSizeModel.findOne({where: {size_id: req.params.id}});
  if(product){
    return res.status(errorCodes.default).send(formatErrorResponse('This size is exists in product.'));
  }

  SizeModel.destroy({ where: { id: req.params.id} }).then(result => {
    res.send(formatResponse("", 'Size deleted Successfully!'));
  }).catch(error => {
    return res.status(errorCodes.default).send(formatErrorResponse(error));
  });
};
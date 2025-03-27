const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { getPaginationOptions } = require('@helpers/paginator')
const { convertToSlug, isEmpty } = require("@helpers/helper");
const {SubCategoryCollection} = require("@resources/superadmin/SubCategoryCollection");
const SubCategoryModel = db.sub_categories;
const CategoryModel = db.categories;

/**
 * Retrieve all Sub categories
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, category_id, all } = req.query;
  let conditions = {};
  if(!isEmpty(category_id)){
    conditions.category_id = category_id;
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

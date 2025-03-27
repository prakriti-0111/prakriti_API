const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { getPaginationOptions } = require('@helpers/paginator')
const {CategoryCollection} = require("@resources/sales_executive/CategoryCollection");
const CategoryModel = db.categories;
const SubCategoryModel = db.sub_categories;

/**
 * Retrieve all categories
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, all } = req.query;
  if(all == 1){
    CategoryModel.findAll({ 
      order:[['id', 'ASC']],
      include:[
        {
          model: SubCategoryModel,
          as: 'subCategories',
          where: {status: 1},
        }
      ]
    }).then(async (data) => {
      let result = {
        items: CategoryCollection(data),
        total: data.length
      }
      res.send(formatResponse(result, 'Categories'));
    })
    .catch(err => {
      res.status(errorCodes.default).send(formatErrorResponse(err));
    });
  }else{
    const paginatorOptions = getPaginationOptions(page, limit);
    CategoryModel.findAndCountAll({ 
        order:[['id', 'ASC']],
        offset: paginatorOptions.offset,
        limit: paginatorOptions.limit,
        include:[
          {
            model: SubCategoryModel,
            as: 'subCategories',
            where: {status: 1},
          }
        ]
      }).then(async (data) => {
        let result = {
          items: CategoryCollection(data.rows),
          total: data.count,
        }
        res.send(formatResponse(result, 'Categories'));
      })
      .catch(err => {
        res.status(errorCodes.default).send(formatErrorResponse(err));
      });
    };
  }

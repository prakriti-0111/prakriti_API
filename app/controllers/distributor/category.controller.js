const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { getPaginationOptions } = require('@helpers/paginator')
const { convertToSlug } = require("@helpers/helper");
const {CategoryCollection} = require("@resources/superadmin/CategoryCollection");
const CategoryModel = db.categories;

/**
 * Retrieve all categories
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, all } = req.query;
  if(all == 1){
    CategoryModel.findAll({ 
      order:[['name', 'ASC']]
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
        order:[['id', 'DESC']],
        offset: paginatorOptions.offset,
        limit: paginatorOptions.limit,
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

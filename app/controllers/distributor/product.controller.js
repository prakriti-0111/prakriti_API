const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { Op } = require("sequelize");
const { getPaginationOptions } = require('@helpers/paginator')
const {ProductCollection} = require("@resources/distributor/ProductCollection");
const stocksModel = db.stocks;
const { isEmpty, priceFormat } = require("@helpers/helper");
const productsModel = db.products;
const sizesModel= db.sizes;
const stock_materialsModel =db.stock_materials;
const materialModel =db.materials
const UnitModel = db.units;
const PurityModel = db.purities;
const TaxSlabModel = db.tax_slabs;
const SubCategoryModel = db.sub_categories;
const CategoryModel = db.categories;
const CertificateModel = db.certificates;

/**
 * Retrieve all product
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, category_id, sub_category_id } = req.query;
  let conditions = {};
  if(!isEmpty(category_id)){
    conditions.category_id = category_id;
  }
  if(!isEmpty(sub_category_id)){
    conditions.sub_category_id = sub_category_id;
  }
  const paginatorOptions = getPaginationOptions(page, limit);
  productsModel.findAndCountAll({ 
    order:[['id', 'DESC']],
    where: conditions,
    offset: paginatorOptions.offset,
    limit: paginatorOptions.limit,
    include: [
      {
        model: CategoryModel,
        as: 'category'
      },
      {
        model: SubCategoryModel,
        as: 'sub_category'
      },
      {
        model: stocksModel,
        as: 'stocks',
        required: true ,
        where: {user_id: {[Op.is]: null}},
        include: [
          {
            model:sizesModel,
            as: 'size'
          },
          {
            model: stock_materialsModel,
            as: 'stockMaterials',
            include:[
              {
                model: materialModel,
                as:'material'
              },
              {
                model:UnitModel,
                as: 'unit'
              },
              {
                model:PurityModel,
                as: 'purity'
              }
            ]
          }
        ]
      }
    ]
  }).then(async (data) => {
    let result = {
      items: await ProductCollection(data.rows),
      total: data.count,
    }
    res.send(formatResponse(result, 'Product List'));
  })
  .catch(err => {
      res.status(errorCodes.default).send(formatErrorResponse(err));
  });
}

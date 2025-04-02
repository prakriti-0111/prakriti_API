const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { base64FileUpload, base64VideoFileUpload, removeFile, filterFilesFromRemove } = require('@helpers/upload');
const {isEmpty, isArray} = require("@helpers/helper");
const {updateOrCreate} = require("@library/common");
const { getPaginationOptions } = require('@helpers/paginator')
const {ProductCollection} = require("@resources/superadmin/ProductCollection");
const { Op } = require("sequelize");
const sequelize = db.sequelize;
const ProductModel = db.products;
const ProductMaterialModel = db.product_materials;
const ProductSizeModel = db.product_sizes;
const CategoryModel = db.categories;
const SubCategoryModel = db.sub_categories;
const CertificateModel = db.certificates;
const MaterialModel = db.materials;
const SizeModel = db.sizes;
const PurityModel = db.purities;
const UnitModel = db.units;

/**
 * Retrieve all product categories
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, all } = req.query;

  if(all == 1){
    ProductModel.findAll({
      order:[['name', 'ASC']],
      include: [
        {
          model: CategoryModel,
          as: 'category',
        },
        {
          model: SubCategoryModel,
          as: 'sub_category',
        },
        {
          model: CertificateModel,
          as: 'certificate',
        },
        {
          model: MaterialModel,
          as: 'materials',
          order:[['name','DESC']],
          include: [
            {
              model: UnitModel,
              as: 'unit',
            },
            {
              model: PurityModel,
              as: 'purities',
            }
          ]
        },
        {
          model: SizeModel,
          as: 'sizes',
        }
      ]
    }).then(async (data) => {
      let result = {
        items: await ProductCollection(data),
        total: data.length
      }
      res.send(formatResponse(result, 'All Products'));
    })
    .catch(err => {
      res.status(errorCodes.default).send(formatErrorResponse(err));
    });
  }else{

    const paginatorOptions = getPaginationOptions(page, limit);
    ProductModel.findAndCountAll({ 
      order:[['id', 'ASC']],
      offset: paginatorOptions.offset,
      limit: paginatorOptions.limit,
      include: [
        {
          model: CategoryModel,
          as: 'category',
        },
        {
          model: SubCategoryModel,
          as: 'sub_category',
        },
        {
          model: CertificateModel,
          as: 'certificate',
        },
        {
          model: MaterialModel,
          as: 'materials',
        },
        {
          model: SizeModel,SizeModel,
          as: 'sizes',
        }
      ]
    }).then(async (data) => {
      let result = {
        items: await ProductCollection(data.rows),
        total: data.count,
      }
      res.send(formatResponse(result, 'Product Categories'));
    })
    .catch(err => {
      res.status(errorCodes.default).send(formatErrorResponse(err));
    });
  }
};

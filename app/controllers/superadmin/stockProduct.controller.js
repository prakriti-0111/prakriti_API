const config = require("@config/auth.config");
const {
  errorCodes,
  formatErrorResponse,
  formatResponse,
} = require("@utils/response.config");
const db = require("@models");
const {
  base64FileUpload,
  base64VideoFileUpload,
  removeFile,
  filterFilesFromRemove,
} = require("@helpers/upload");
const {
  isEmpty,
  isArray,
  convertToSlug,
  addLog,
  convertUnitToGram,
  weightFormat,
} = require("@helpers/helper");
const { updateOrCreate, isManager, getWorkingUserID } = require("@library/common");
const { getPaginationOptions } = require("@helpers/paginator");
const {
  ProductCollection,
} = require("@resources/superadmin/ProductCollection");
const {
  CategoryCollection,
} = require("@resources/superadmin/CategoryCollection");
const {
  StocksCollection,
} = require("@resources/superadmin/StocksCollection");
const { Op } = require("sequelize");
const order = require("../../../models/order");
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
const TaxSlabModel = db.tax_slabs;
const ProductCertificateModel = db.product_certificates;
const ProductSizeMaterialModel = db.product_size_materials;
const ProductTagModel = db.product_tags;
const PurchaseProductModel = db.purchase_products;
const SaleProductModel = db.sale_products;
const StockModel = db.stocks;
const StockMaterialModel = db.stock_materials;

/**
 * Retrieve all product categories
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, all, category_id, sub_category_id, search, purity_price } =
    req.query;
  let conditions = {};
  let userID = isManager(req)
        ? req.userId
        : await getWorkingUserID(req);
  if (all == 1) {

    let productConditions = {};
    if(!isEmpty(search)){
      productConditions = {...productConditions, [Op.or]: [{ name: { [Op.like]: `%${search}%` } }, { weight: search }]};
    }

    let _include = [
      {
        model: SizeModel,
        as: "size",
        //where: sizeConditions,
      },
      {
        model: StockMaterialModel,
        as: "stockMaterials",
        required: true,
        //where: stockMaterialConditions,
        separate: true,
        include: [
          {
            model: MaterialModel,
            as: "material",
          },
          {
            model: UnitModel,
            as: "unit",
          },
          {
            model: PurityModel,
            as: "purity",
          },
        ],
      },
      {
        model: ProductModel,
        as: "product",
        required: true,
        where: productConditions,
        include: [
          {
            model: CategoryModel,
            as: "category",
            required: true,
            where: !isEmpty(category_id) ? { id: category_id } : {},
          },
          {
            model: SubCategoryModel,
            as: "sub_category",
            required: true,
            where: !isEmpty(sub_category_id) ? { id: sub_category_id } : {},
          },
          {
            model: CertificateModel,
            as: "certificates",
          },
          {
            model: TaxSlabModel,
            as: "tax",
          },
          {
            model: ProductTagModel,
            as: 'tags',
          }
        ],
      }
    ];

    StockModel
      .findAndCountAll({
        order: [["id", "DESC"]],
        //...paginatorOptions,
        where: conditions,
        include: _include,
        distinct: true,
        //...subQueryData
      }).then(async (data) => {
        //compactLog(data.rows[0].product);
        let result = {
          this: "all current stocks ",
          items: await StocksCollection(data.rows, userID),
          total: data.count,
        };
        res.send(formatResponse(result, "All Current Stocks"));
      })
      .catch((err) => {
        res.status(errorCodes.default).send(formatErrorResponse(err));
      }); 



    /* ProductModel.findAll({
      order: [["name", "DESC"]],
      where: conditions,
      include: [
        {
          model: CategoryModel,
          as: "category",
          required: true,
          where: !isEmpty(category_id) ? { id: category_id } : {},
        },
        {
          model: SubCategoryModel,
          as: "sub_category",
          required: true,
          where: !isEmpty(sub_category_id) ? { id: sub_category_id } : {},
        },
        {
          model: TaxSlabModel,
          as: "tax",
        },
        
        {
          order: [["id", "ASC"]],
          model: MaterialModel,
          as: "materials",
          include: [
            {
              model: UnitModel,
              as: "unit",
            },
            {
              model: PurityModel,
              as: "purities",
            },
          ],
        },
        {
          model: SizeModel,
          as: "sizes",
        },
        {
          model: CertificateModel,
          as: "certificates",
        },
      ],
    })
      .then(async (data) => {
        let result = {
          this: "rhaul the side ",
          items: await ProductCollection(data, { purity_price: purity_price }),
          total: data.length,
        };
        res.send(formatResponse(result, "All Products"));
      })
      .catch((err) => {
        res.status(errorCodes.default).send(formatErrorResponse(err));
      }); */
  } else {
    const paginatorOptions = getPaginationOptions(page, limit);
    ProductModel.findAndCountAll({
      order: [["id", "DESC"]],
      offset: paginatorOptions.offset,
      limit: paginatorOptions.limit,
      where: conditions,
      include: [
        {
          model: CategoryModel,
          as: "category",
          required: true,
          where: !isEmpty(category_id) ? { id: category_id } : {},
        },
        {
          model: SubCategoryModel,
          as: "sub_category",
          required: true,
          where: !isEmpty(sub_category_id) ? { id: sub_category_id } : {},
        },
        /*{
          model: CertificateModel,
          as: 'certificates',
        },*/
        /* {
          order:[['id', 'ASC']],
          model: ProductMaterialModel,
          as: 'pmaterials',
          include: [
            
          ]
        }, */
        {
          order: [["id", "ASC"]],
          model: MaterialModel,
          as: "materials",
          include: [
            {
              model: UnitModel,
              as: "unit",
            },
            {
              model: PurityModel,
              as: "purities",
            },
          ],
        },
        /*{
          model: SizeModel,
          as: 'sizes',
        },
        {
          model: ProductTagModel,
          as: 'tags',
        }*/
      ],
      distinct: true,
    })
      .then(async (data) => {
        let result = {
          this: "find and count all",
          items: await ProductCollection(data.rows),
          total: data.count,
        };
        res.send(formatResponse(result, "Product Categories"));
      })
      .catch((err) => {
        res.status(errorCodes.default).send(formatErrorResponse(err));
      });
  }
};

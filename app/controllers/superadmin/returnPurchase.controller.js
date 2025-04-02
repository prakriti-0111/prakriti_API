const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const moment = require('moment');
const {isEmpty, getDateFromToWhere, priceFormat, formatDateTime, weightFormat, addLog, convertUnitToGram} = require("@helpers/helper");
const {updateOrCreate, removeMaterialFromStock, getWalletBalance, getWorkingUserID, isSuperAdmin, isManager} = require("@library/common");
const { getPaginationOptions } = require('@helpers/paginator')
const {ReturnPurchaseCollection} = require("@resources/superadmin/ReturnPurchaseCollection");
const {ReturnPurchaseListCollection} = require("@resources/superadmin/ReturnPurchaseListCollection");
const { Op } = require("sequelize");
const sequelize = db.sequelize;
const ProductModel = db.products;
const UserModel = db.users;
const ProductSizeModel = db.product_sizes;
const PurityModel = db.purities;
const UnitModel = db.units;
const CategoryModel = db.categories;
const SubCategoryModel = db.sub_categories;
const CertificateModel = db.certificates;
const MaterialModel = db.materials;
const SizeModel = db.sizes;
const StockModel = db.stocks;
const StockMaterialModel = db.stock_materials;
const PurchaseModel = db.purchases;
const PurchaseProductModel = db.purchase_products;
const PurchaseProductMaterialModel = db.purchase_product_materials;
const stockHistoryModel = db.stock_raw_material_histories;
const paymentModel = db.payments;
const ReturnModel = db.returns;
const ReturnProductModel = db.return_products;
const ReturnProductMaterialModel = db.return_product_materials;
const SaleModel = db.sales;
const SaleProductModel = db.sale_products;
const SaleProductMaterialModel = db.sale_product_materials;

/**
 * Retrieve all purchase
 * 
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, supplier_id, search, date_from, date_to, status, sale_return } = req.query;
  let userID = isManager(req) ? req.userId : await getWorkingUserID(req);
  let conditions = {};
  conditions = {user_id: userID, table_type: 'purchases'};

  let purchase_con = {};
  if(!isEmpty(supplier_id)){
    purchase_con.supplier_id = supplier_id;
  }
  if(!isEmpty(search)){
    purchase_con.invoice_number = {[Op.like]: `%${search}%` };
  }
  conditions = {...conditions, ...getDateFromToWhere(date_from, date_to)}

  const paginatorOptions = getPaginationOptions(page, limit);
  ReturnModel.findAndCountAll({ 
    order:[['id', 'DESC']],
    offset: paginatorOptions.offset,
    limit: paginatorOptions.limit,
    where: conditions,
    include: [
      {
        model: PurchaseModel,
        as: 'purchase',
        where: purchase_con,
        include: [
          {
            model: UserModel,
            as: 'supplier',
          }
        ]
      }
    ]
  }).then(async (data) => {
    let result = {
      items: ReturnPurchaseListCollection(data.rows),
      total: data.count,
    }
    res.send(formatResponse(result));
  })
  .catch(err => {
    res.status(errorCodes.default).send(formatErrorResponse(err));
  });
};


/**
 * View Purchase
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.view = async (req, res) => {
  let purchase = await ReturnModel.findOne({ where: { id: req.params.id },
    include: [
      {
        model: PurchaseModel,
        as: 'purchase',
        include: [
          {
            model: UserModel,
            as: 'supplier',
          }
        ]
      },
      {
        model: ReturnProductModel,
        as: 'returnProducts',
        separate: true,
        include: [
          {
            model: PurchaseProductModel,
            as: 'purchaseProduct',
            include: [
              {
                model: ProductModel,
                as: 'product',
                include: [
                  {
                    model: CategoryModel,
                    as: 'category'
                  }
                ]
              },
              {
                model: SizeModel,
                as: 'size',
              },
            ]
          },
          {
            model: ReturnProductMaterialModel,
            as: 'returnMaterials',
            separate: true,
            include: [
              {
                model: MaterialModel,
                as: 'material',
              },
              {
                model: PurityModel,
                as: 'purity'
              },
              {
                model: UnitModel,
                as: 'unit'
              }
            ]
          }
        ]
      }
    ]
  });
  if (!purchase) {
    return res.status(errorCodes.default).send(formatErrorResponse('Return not found'));
  }
  res.send(formatResponse(await ReturnPurchaseCollection(purchase)));
};



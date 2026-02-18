const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const moment = require('moment');
const {isEmpty, getDateFromToWhere, statusDisplay} = require("@helpers/helper");
const {isAdmin, isSalesExecutive, isDistributor, getAdminDistributorIds, sendNotification} = require("@library/common");
const { getPaginationOptions } = require('@helpers/paginator')
const {ReturnOrderCollection} = require("@resources/superadmin/ReturnOrderCollection");
const {ReturnOrderListCollection} = require("@resources/superadmin/ReturnOrderListCollection");
const { Op } = require("sequelize");
const sequelize = db.sequelize;
const ProductModel = db.products;
const UserModel = db.users;
const PurityModel = db.purities;
const UnitModel = db.units;
const CategoryModel = db.categories;
const MaterialModel = db.materials;
const SizeModel = db.sizes;
const OrderModel = db.orders;
const ReturnModel = db.returns;
const ReturnProductModel = db.return_products;
const ReturnProductMaterialModel = db.return_product_materials;
const orderProductModel = db.order_products;

/**
 * Retrieve all purchase
 * 
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, search, date_from, date_to, status} = req.query;
  let conditions = {table_type: "orders"}
  if(isDistributor(req)){
    conditions.to_user_id = req.userId;
  }else if(isSalesExecutive(req)){
    conditions.sales_executive_id = req.userId;
  }else if(isAdmin(req)){
    conditions.to_user_id = {[Op.in]: await getAdminDistributorIds(req.userId)};
  }
  if(!isEmpty(status)){
    conditions.status = status;
  }
  conditions = {...conditions, ...getDateFromToWhere(date_from, date_to)}

  let order_con = {};
  if(!isEmpty(search)){
    order_con.order_no = {[Op.like]: `%${search}%` };
  }

  const paginatorOptions = getPaginationOptions(page, limit);
  ReturnModel.findAndCountAll({ 
    order:[['id', 'DESC']],
    offset: paginatorOptions.offset,
    limit: paginatorOptions.limit,
    where: conditions,
    include: [
      {
        model: OrderModel,
        as: 'order',
        where: order_con,
        include: [
          {
            model: UserModel,
            as: 'orderFrom',
          }
        ]
      },
      {
        model: ReturnProductModel,
        as: 'returnProducts',
        separate: true
      },
      {
        model: UserModel,
        as: 'saleExecutive'
      }
    ]
  }).then(async (data) => {
    let result = {
      items: ReturnOrderListCollection(data.rows),
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
  let conditions = {table_type: "orders", id: req.params.id}
  if(isDistributor(req)){
    conditions.to_user_id = req.userId;
  }else if(isSalesExecutive(req)){
    conditions.sales_executive_id = req.userId;
  }else if(isAdmin(req)){
    conditions.to_user_id = {[Op.in]: await getAdminDistributorIds(req.userId)};
  }

  let returnObj = await ReturnModel.findOne({ where: conditions,
    include: [
      {
        model: OrderModel,
        as: 'order',
        include: [
          {
            model: UserModel,
            as: 'orderFrom',
          }
        ]
      },
      {
        model: ReturnProductModel,
        as: 'returnProducts',
        separate: true,
        include: [
          {
            model: orderProductModel,
            as: 'orderProduct',
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
      },
      {
        model: UserModel,
        as: 'saleExecutive'
      }
    ]
  });
  if (!returnObj) {
    return res.status(errorCodes.default).send(formatErrorResponse('Return not found.'));
  }
  res.send(formatResponse(await ReturnOrderCollection(returnObj)));
};


/**
 * Order Assign
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.orderAssign = async (req, res) => {
  let returnOrder = await ReturnModel.findOne({ where: { id: req.params.id }});
  if(!returnOrder){
    return res.status(errorCodes.default).send(formatErrorResponse('Return not found.'));
  }
  let order = await OrderModel.findOne({where: {id: returnOrder.table_id}});
  if(!order){
    return res.status(errorCodes.default).send(formatErrorResponse('Return not found.'));
  }

  await ReturnModel.update({sales_executive_id: req.body.user_id}, { where: { id: returnOrder.id } });

  //send notification
  sendNotification('return_order_assigned', req, {returnOrder: returnOrder, order: order, sales_executive_id: req.body.user_id});

  res.send(formatResponse("", "Assigned successfully."));

}

/**
 * Update Order Status
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.updateOrderStatus = async (req, res) => {
  let returnOrder = await ReturnModel.findOne({ where: { id: req.params.id }});
  if(!returnOrder){
    return res.status(errorCodes.default).send(formatErrorResponse('Return not found.'));
  }

  let data = req.body;
  let obj = {
    status: data.status
  }
  if(data.status == "picked_up"){
    obj.picked_up_at = moment().format('YYYY-MM-DD HH:mm:ss')
  }else if(data.status == "cancelled"){
    obj.cancelled_at = moment().format('YYYY-MM-DD HH:mm:ss')
  }

  await ReturnModel.update(obj, { where: { id: returnOrder.id } });
  await OrderModel.update(obj, { where: { id: returnOrder.table_id } });

  res.send(formatResponse([], `${statusDisplay(data.status)} Successfully.`));

}

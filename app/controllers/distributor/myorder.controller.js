const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { Op } = require("sequelize");
const { getPaginationOptions } = require('@helpers/paginator')
const {OrderCollection} = require("@resources/distributor/OrderCollection");
const {CartCollection} = require("@resources/distributor/CartCollection");
const {CartMaterialCollection} = require("@resources/distributor/CartMaterialCollection");
const orderModel = db.orders;
const { isEmpty, generateOrderNo, getDateFromToWhere } = require("@helpers/helper");
const { getDistributorAdmin, getRoleId, sendNotification, getSuperAdminId } = require("@library/common");
const cartModel = db.carts;
const cartMaterialsModel =db.cart_materials;
const orderMaterialsModel =db.order_materials;
const materialPriceModel = db.material_prices
const materialPricePurityModel = db.material_price_purities
const materialModel = db.materials;
const orderProductModel = db.order_products;
const UnitModel = db.units;
const productModel = db.products
const sizeModel = db.sizes
const PurityModel = db.purities;
const cartsModel = db.carts;
const UserModel = db.users;
const RoleModel = db.roles;
const CategoryModel = db.categories;

/**
 * Retrieve all Unit
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, status, date_from, date_to, my_order, order_from } = req.query;
  let conditions = {};
  if(my_order == 1){
    conditions.user_id = req.userId;
  }else{
    conditions.to_user_id = req.userId;
  }
  let from_user_con = {};
  if(order_from == 'retailer'){
    from_user_con.id = getRoleId('retailer');
  }else if(order_from == 'customer'){
    from_user_con.id = getRoleId('customer');
  }
  
  if(!isEmpty(status)){
    conditions.status = status;
  }
  conditions = {...conditions, ...getDateFromToWhere(date_from, date_to)}

  const paginatorOptions = getPaginationOptions(page, limit);
  orderModel.findAndCountAll({ 
    order:[['id', 'DESC']],
    where: conditions,
    offset: paginatorOptions.offset,
    limit: paginatorOptions.limit,
    include: [
      {
        model: orderProductModel,
        as: 'orderProducts',
        separate: true
      },
      {
        model: UserModel,
        as: 'orderFrom',
        include: [
          {
            model: RoleModel,
            as: 'role',
            where: from_user_con
          }
        ]
      },
      {
        model: UserModel,
        as: 'saleExecutive'
      },
      {
        model: UserModel,
        as: 'orderBy'
      }
  ]}).then(async (data) => {
    let result = {
      items: await OrderCollection(data.rows),
      total: data.count,
    }
    res.send(formatResponse(result, 'orders'));
  })
  .catch(err => {
    res.status(errorCodes.default).send(formatErrorResponse(err));
  });
}

/**
 * Create Order
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.placeOrder = async (req, res) => {
  let data = req.body;

  let carts = await cartModel.findAll({
    where: {user_id: req.userId},
    include: [
      {
        model: cartMaterialsModel,
        as: 'cartMaterial',
        separate: true,
        include:[
          {
            model: materialModel,
            as:'material'
          },
          {
            model: UnitModel,
            as:'unit'
          },
          {
            model: PurityModel,
            as:'purity'
          }
        ]
      },
      {
        model: productModel,
        as: 'product',
        include: [
          {
            model: CategoryModel,
            as: 'category'
          }
        ]
      },
      {
        model: sizeModel,
        as: 'size'
      }
    ]
  });
  if(carts.length == 0){
    return res.status(errorCodes.default).send(formatErrorResponse('Please add product into cart.'));
  }

  let adminId = await getDistributorAdmin(req.userId);
  let order = await orderModel.create({
    user_id: req.userId,
    //to_user_id: adminId,
    status: 'pending',
    notes: data.notes
  });

  let cartIds = [];
  for(let i = 0; i < carts.length; i++){
    let product = await productModel.findOne({where: {id: carts[i].product_id}});
    let orderProduct = await orderProductModel.create({
      order_id: order.id,
      product_id: carts[i].product_id,
      size_id: product.product_type != 'material' ? carts[i].size_id : null,
      quantity: carts[i].quantity,
      discount: carts[i].discount,
      discount_type: carts[i].discount_type,
      rate: carts[i].rate,
    });
    await cartModel.update({
      order_id: order.id,
      order_product_id: orderProduct.id,
      user_id: null,
      cookie_id: null
    }, {where: {id: carts[i].id}});
    for(let x = 0; x < carts[i].cartMaterial.length; x++){
      let cartMaterial = carts[i].cartMaterial[x];
      await orderMaterialsModel.create({
        order_id: order.id,
        order_product_id: orderProduct.id,
        product_id: carts[i].product_id,
        material_id: cartMaterial.material_id,
        purity_id: cartMaterial.purity_id,
        weight: cartMaterial.weight,
        quantity: cartMaterial.quantity,
        unit_id: cartMaterial.unit_id,
      });
    }

    cartIds.push(carts[i].id);
  }

  let order_no = generateOrderNo(order.id);
  await orderModel.update({order_no: order_no}, { where: { id: order.id } });

  //await cartsModel.destroy({ where: { id: {[Op.in]: cartIds} }});
  //await cartMaterialsModel.destroy({ where: { cart_id: {[Op.in]: cartIds} }});

   //send notification
   let superadminId = await getSuperAdminId();
   sendNotification('order_placed', req, { order: {
     id: order.id,
     to_user_id: superadminId
   }, order_no: order_no });
  
  res.send(formatResponse("", "Order placed successfully!"));
}


/**
 * Cancel Order
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.cancelOrder = async (req, res) => {
  let data = req.body;
  let order = await orderModel.findOne({ where: { id: req.params.id }});
  await orderModel.update({status: 'cancelled'}, { where: { id: req.params.id } });

  sendNotification('order_cancel', req, { order: order });

  res.send(formatResponse([], "Order cancelled successfully!"));

}


/**
 * View Order
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.fetch = async (req, res) => {
  let order = await orderModel.findOne({ where: { id: req.params.id },
    include: [
      {
        model: orderProductModel,
        as: 'orderProducts',
        separate: true,
        include: [
          {
            model: orderMaterialsModel,
            as: 'orderProductMaterials',
            separate: true,
            include:[
              {
                model: materialModel,
                as:'material'
              },
              {
                model: UnitModel,
                as:'unit'
              },
              {
                model: PurityModel,
                as:'purity'
              }
            ]
          },
          {
            model: productModel,
            as: 'product'
          },
          {
            model: sizeModel,
            as: 'size'
          }
        ]
      },
      {
        model: UserModel,
        as: 'orderFrom',
        include: [
          {
            model: RoleModel,
            as: 'role'
          }
        ]
      },
      {
        model: UserModel,
        as: 'saleExecutive'
      }
    ]
  });
  if (!order) {
    return res.status(errorCodes.default).send(formatErrorResponse('order not found'));
  }
  res.send(formatResponse(await OrderCollection(order), "order fetched successfully!"));
};


/**
 * Order Assign
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.orderAssign = async (req, res) => {
  let order = await orderModel.findOne({ where: { id: req.params.id }});

  await orderModel.update({sales_executive_id: req.body.user_id}, { where: { id: order.id } });

  //send notification
  sendNotification('order_assigned', req, {order: order, sales_executive_id: req.body.user_id});

  res.send(formatResponse("", "Order assigned successfully."));

}




    
 

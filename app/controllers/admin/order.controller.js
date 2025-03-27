const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { Op } = require("sequelize");
const { getPaginationOptions } = require('@helpers/paginator');
const {OrderCollection} = require("@resources/distributor/OrderCollection");
const {CartCollection} = require("@resources/distributor/CartCollection");
const {CartMaterialCollection} = require("@resources/distributor/CartMaterialCollection");
const orderModel = db.orders;
const { isEmpty, generateOrderNo, getDateFromToWhere } = require("@helpers/helper");
const { getAdminDistributorIds, sendNotification, getSuperAdminId } = require("@library/common");
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

/**
 * Retrieve all Unit
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, status, date_from, date_to, my_orders } = req.query;
  let conditions = {};
  
  if(!isEmpty(status)){
    conditions.status = status;
  }
  if(my_orders == 1){
    conditions.user_id = req.userId;
  }else{
    conditions.to_user_id = {[Op.in]: await getAdminDistributorIds(req.userId)};
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
            as: 'role'
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
    where: {user_id: req.userId, type: 'order'},
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
        as: 'product'
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

  //let user = await UserModel.findOne({where: { id: req.userId}});
  //let admin = await UserModel.findOne({where: {state_id: user.state_id}});

  let order = await orderModel.create({
    user_id: req.userId,
    //to_user_id: admin ? admin.id : null,
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

  if(order.user_id != req.userId){
    sendNotification('order_cancel', req, { order: order });
  }

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



    
 

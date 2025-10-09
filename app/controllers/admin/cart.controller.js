const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { Op } = require("sequelize");
const { getPaginationOptions } = require('@helpers/paginator')
const {CartCollection} = require("@resources/distributor/CartCollection");
const {ProductMaterialCollection} = require("@resources/distributor/ProductMaterialCollection");
const cartsModel = db.carts;
const { isEmpty } = require("@helpers/helper");
const { findIndex } = require("lodash");
const cartMaterialsModel =db.cart_materials;
const materialModel =db.materials
const UnitModel = db.units;
const productModel = db.products
const sizeModel = db.sizes
const productMaterialModel = db.product_materials;
const PurityModel = db.purities;

/**
 * Retrieve all Cart
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, all } = req.query;
  let conditions = {user_id: req.userId, type: 'order'};
  const paginatorOptions = getPaginationOptions(page, limit);
  cartsModel.findAndCountAll({ 
  order:[['id', 'ASC']],
  where: conditions,
  //offset: paginatorOptions.offset,
  //limit: paginatorOptions.limit,
  include: [
    {
      model: cartMaterialsModel,
      as: 'cartMaterial',
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
}).then(async (data) => {
  let result = {
    items: CartCollection(data.rows),
    total: data.rows.length,
  }
  res.send(formatResponse(result, 'carts'));
})
.catch(err => {
  res.status(errorCodes.default).send(formatErrorResponse(err));
});
}

/**
 * Create Cart
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
  let data = req.body;

  // Check for duplicate certificate number if provided
  if (!isEmpty(data.certificate_no)) {
    // Check if certificate already exists in current user's cart
    let existingCartWithCert = await cartsModel.findOne({
      where: {
        user_id: req.userId,
        certificate_no: data.certificate_no,
        type: 'order'
      }
    });

    if (existingCartWithCert) {
      return res.status(errorCodes.default).send(formatErrorResponse("Certificate number " + data.certificate_no + " already exists in cart."));
    }

    // Check if certificate exists in stocks
    let stockModel = db.stocks;
    let existingStock = await stockModel.findOne({
      where: {
        certificate_no: data.certificate_no,
        user_id: req.userId
      }
    });

    if (existingStock) {
      return res.status(errorCodes.default).send(formatErrorResponse("Certificate number " + data.certificate_no + " already exists in stocks."));
    }
  }

  // Check if cart item already exists with same product, size, and materials
  let existingCart = await cartsModel.findOne({
    where: {
      user_id: req.userId,
      product_id: data.product_id,
      size_id: data.size_id || null,
      type: 'order'
    }
  });

  if (existingCart) {
    // Check if materials match
    let isMaterialsMatch = true;
    let existingMaterials = await cartMaterialsModel.findAll({
      where: { cart_id: existingCart.id }
    });

    if (data.materials.length !== existingMaterials.length) {
      isMaterialsMatch = false;
    } else {
      for (let i = 0; i < data.materials.length; i++) {
        let material = data.materials[i];
        let found = existingMaterials.find(existing => 
          existing.material_id === material.material_id && 
          existing.purity_id === material.purity_id
        );
        if (!found) {
          isMaterialsMatch = false;
          break;
        }
      }
    }

    if (isMaterialsMatch) {
      // Update existing cart quantity
      let newQuantity = (existingCart.quantity || 0) + (data.quantity || 1);
      await cartsModel.update(
        { quantity: newQuantity },
        { where: { id: existingCart.id } }
      );
      return res.send(formatResponse([], "Cart updated successfully."));
    }
  }

  let cart = await cartsModel.create({
    user_id: req.userId,
    product_id: data.product_id,
    size_id: data.size_id || null,
    quantity: data.quantity || null,
    total_weight: data.total_weight || null,
    certificate_no: data.certificate_no || null,
    type: 'order'
  });
  
  for(let x = 0; x < data.materials.length; x++){
    let material = data.materials[x];
    await cartMaterialsModel.create({
      cart_id: cart.id,
      material_id: material.material_id,
      purity_id: material.purity_id,
      weight: material.weight,
      unit_id: material.unit_id,
      quantity: material.quantity
    });
  }

  res.send(formatResponse([], "Product added to cart successfully."));

}

    
 /**
 * Remove Cart
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  await cartsModel.destroy({ where: { id: req.params.id, user_id: req.userId, type: 'order'} });
  await cartMaterialsModel.destroy({ where: { cart_id: req.params.id} });

  res.send(formatResponse([], "Product removed from cart successfully."));

}





const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { getPaginationOptions } = require('@helpers/paginator')
const {WishlistCollection} = require("@resources/customer/WishlistCollection");
const { isEmpty, addLog } = require("@helpers/helper");
const WishlistModel = db.wishlists;
const ProductModel = db.products;
const SizeModel = db.sizes;
const MaterialModel = db.materials;
const WishlistMaterialModel = db.wishlist_materials;
const PurityModel = db.purities;
const CategoryModel = db.categories;
const SubCategoryModel = db.sub_categories;
const TaxSlabModel = db.tax_slabs;
const UnitModel = db.units;
const cartMaterialsModel =db.cart_materials;
const cartsModel = db.carts;

/**
 * Retrieve all wishlists
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, all } = req.query;
  const paginatorOptions = getPaginationOptions(page, limit);

  WishlistModel.findAndCountAll({ 
    order:[['id', 'DESC']],
    //offset: paginatorOptions.offset,
    //limit: paginatorOptions.limit,
    where: {user_id: req.userId},
    include: [
      {
        model: WishlistMaterialModel,
        as: 'wishlistMaterial',
        include:[
          {
            model: MaterialModel,
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
        model: ProductModel,
        as: 'product',
        include:[
          {
            model: SubCategoryModel,
            as: 'sub_category',
            required: true
          },
          {
            model: TaxSlabModel,
            as: 'tax',
          }
        ]
      },
      {
        model: SizeModel,
        as: 'size'
      }
    ]
  }).then(async (data) => {
    let result = {
      items: await WishlistCollection(data.rows, req.role),
      total: data.rows.length,
    }

    res.send(formatResponse(result, 'wishlist list'));
  })
  .catch(err => {
    res.status(errorCodes.default).send(formatErrorResponse(err));
  });

}


/**
 * Add product to wishlist
 * @param req
 * @param res
 */

exports.updateWishlist = async (req, res) => {
  let data = req.body;
  let product_id = data.product_id;
  let size_id = !isEmpty(data.size_id) ? data.size_id : '';
  let query = {product_id: product_id, user_id: req.userId};

  if(!isEmpty(size_id)){
    query.size_id = size_id;
  }
  
  let existing_wishlist = await WishlistModel.findOne({where: query});

  if(!isEmpty(existing_wishlist)){
    if('from_cart' in data && data.from_cart == 1){
      let total = await WishlistModel.count({where: {user_id: req.userId}});
      return res.send(formatResponse({status: false, product_id: product_id, total: total}, 'Removed from wishlist.'));
    }
    await WishlistModel.destroy({where: {id: existing_wishlist.id}});
    await WishlistMaterialModel.destroy({where: {wishlist_id: existing_wishlist.id}});

    let total = await WishlistModel.count({where: {user_id: req.userId}});
    res.send(formatResponse({status: false, product_id: product_id, total: total}, 'Removed from wishlist.'));
  }
  else{
    let wishlist = await WishlistModel.create({
      product_id: data.product_id,
      user_id: req.userId,
      total_weight: data.total_weight,
        size_id: data.size_id,
      current_image: data.current_image
    });


    for(let x = 0; x < data.materials.length; x++){
      let material = data.materials[x];
      await WishlistMaterialModel.create({
        wishlist_id: wishlist.id,
        material_id: material.material_id,
        purity_id: material.purity_id,
        weight: material.weight,
        unit_id: material.unit_id,
        quantity: material.quantity
      });
    }

    let total = await WishlistModel.count({where: {user_id: req.userId}});

    res.send(formatResponse({status: true, product_id: product_id, total: total}, "Added to wishlist."));
  }
}

/**
 * remove product from wishlist
 * @param req
 * @param res
 */
exports.removeWishlist = async (req, res) => {
  await WishlistModel.destroy({where: {id: req.params.id}});
  await WishlistMaterialModel.destroy({where: {wishlist_id: req.params.id}});

  let total = await WishlistModel.count({where: {user_id: req.userId}});
  res.send(formatResponse({total: total}, 'Remove from wishlist.'));
}

/**
 * add to cart from wishlist
 * @param req
 * @param res
 */
exports.wishlistByNow = async (req, res) => {
  let wishlist = await WishlistModel.findOne({
    where: {id: req.params.id},
    include: [
      {
        model: WishlistMaterialModel,
        as: 'wishlistMaterial',
      }
    ]
  });

  if(!wishlist){
    return res.status(errorCodes.default).send(formatErrorResponse("Wishlist not found."));
  }

  let cart = await cartsModel.findOne({where: {product_id: wishlist.product_id, size_id: wishlist.size_id, user_id: req.userId}});
  let isCartUpdated = false;
  if(cart){
    //check if cart metarials is match
    let isMaterialsMatch = true;
    for(let i = 0; i < wishlist.wishlistMaterial.length; i++){
      let cartMaterial = await cartMaterialsModel.findOne({
        where: {
          cart_id: cart.id, 
          material_id: wishlist.wishlistMaterial[i].material_id,
          purity_id: wishlist.wishlistMaterial[i].purity_id
        }
      });
      if(!cartMaterial){
        isMaterialsMatch = false;
      }
    }

    if(isMaterialsMatch){
      if(parseInt(cart.quantity) < 10){
        await cartsModel.update({quantity: parseInt(cart.quantity) + 1}, { where: { id: cart.id} });
        isCartUpdated = true;
      }
    }
  }

  if(!isCartUpdated){
      let cart = await cartsModel.create({
          product_id: wishlist.product_id,
          current_image: wishlist.current_image,
          stock_id: null,
          user_id: req.userId,
          quantity: 1,
          total_weight: wishlist.total_weight,
          size_id: wishlist.size_id,
          rate: 0,
    });

    for(let x = 0; x < wishlist.wishlistMaterial.length; x++){
      let material = wishlist.wishlistMaterial[x];
      await cartMaterialsModel.create({
        cart_id: cart.id,
        material_id: material.material_id,
        purity_id: material.purity_id,
        weight: material.weight,
        unit_id: material.unit_id,
        quantity: material.quantity
      });
    }
  }

  res.send(formatResponse());
}



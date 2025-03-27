const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { getPaginationOptions } = require('@helpers/paginator')
const {WishlistCollection} = require("@resources/sales_executive/WishlistCollection");
const { isEmpty, addLog } = require("@helpers/helper");
const WishlistModel = db.wishlists;
const ProductModel = db.products;
const SizeModel = db.sizes;
const MaterialModel = db.materials;
const materialPriceModel = db.material_prices
const materialPricePurityModel = db.material_price_purities
const PurityModel = db.purities;

/**
 * Retrieve all wishlists
 * @param req
 * @param res
 */
exports.index = async (req, res) => {  
  let { page, limit, all } = req.query;
  const paginatorOptions = getPaginationOptions(page, limit);
  WishlistModel.findAndCountAll({ 
        order:[['id', 'ASC']],
        offset: paginatorOptions.offset,
        limit: paginatorOptions.limit,
        where: {user_id: req.userId},
        include: [
           {
            model: SizeModel,
            as: 'size',
           },
           {
            model: ProductModel,
            as: 'product',
            include:[
              {
                model: MaterialModel,
                as: 'materials',
                include: [
                  {
                    model: PurityModel,
                    as: 'purities',
                  },
                  {
                    model: materialPriceModel,
                    as: 'material_price',
                    include: [
                      {
                        model: materialPricePurityModel,
                        as: 'materialPricePurities'
                      }
                    ]
                  },
                ]
              },
            ]
           },
        ],
      }).then(async (data) => {
        let result = {
          items: WishlistCollection(data.rows),
          total: data.rows.length,
        }
        res.send(formatResponse(result, 'Wishlist Products'));
      })
      .catch(err => {
        //addLog("error: " + err.toString())
        res.status(errorCodes.default).send(formatErrorResponse(err.toString()));
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
  
  let existing_wishlist = await WishlistModel.findOne({where:query});

  if(!isEmpty(existing_wishlist)){
      //WishlistModel.destroy({ truncate: true });
      WishlistModel.destroy({where: {id: existing_wishlist.id}});
      res.send(formatResponse([{status: false}], "Product successfully removed from wishlist"));
    }
    else{
      WishlistModel.create({product_id: product_id, size_id: size_id, user_id: req.userId, status: 'active'});
      res.send(formatResponse([{status: true}], "Product successfully added in wishlist"));
    }
}

/**
 * check product in wishlist
 */
 exports.checkWishlist = async (req, res) => {
  let data = req.body;
  let product_id = data.product_id;
  let size_id = !isEmpty(data.size_id) ? data.size_id : '';
  let query = {product_id: product_id, user_id: req.userId};

  if(!isEmpty(size_id)){
    query.size_id = size_id;
  }
  
  let existing_wishlist = await WishlistModel.findOne({where:query});

  if(!isEmpty(existing_wishlist)){
      
      res.send(formatResponse([{status: true}], "Product already in wishlist"));
    }
    else{
      res.send(formatResponse([{status: false}], "Product not in wishlist"));
    }
}

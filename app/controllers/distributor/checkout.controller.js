const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { Op } = require("sequelize");
const { getPaginationOptions } = require('@helpers/paginator')
const {CheckoutCollection} = require("@resources/customer/CheckoutCollection");
const cartsModel = db.carts;
const { isEmpty } = require("@helpers/helper");
const cartMaterialsModel =db.cart_materials;
const materialModel =db.materials
const UnitModel = db.units;
const productModel = db.products
const sizeModel = db.sizes
const materialPriceModel = db.material_prices
const materialPricePurityModel = db.material_price_purities

/**
 * Retrieve all Cart
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, all } = req.query;
  let conditions = {user_id: req.userId};
  const paginatorOptions = getPaginationOptions(page, limit);
  cartsModel.findAndCountAll({ 
          order:[['id', 'ASC']],
          where: conditions,
          offset: paginatorOptions.offset,
          limit: paginatorOptions.limit,
          include: [
            {
              model: cartMaterialsModel,
              as: 'cartMaterial',
              include:[
                {
                  model: materialModel,
                  as:'material',
                  include: [
                    {
                      model: UnitModel,
                      as: 'unit'
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
            items: CheckoutCollection(data.rows),
            total: data.count,
          }
          res.send(formatResponse(result, 'carts'));
        })
        .catch(err => {
          res.status(errorCodes.default).send(formatErrorResponse(err));
        });
}






const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const {priceFormat} = require("@helpers/helper");
const {updateOrCreate} = require("@library/common");
const { getPaginationOptions } = require('@helpers/paginator')
const {MaterialPriceCollection} = require("@resources/superadmin/MaterialPriceCollection");
const { Op } = require("sequelize");
const sequelize = db.sequelize;
const PurityModel = db.purities;
const MaterialModel = db.materials;
const MaterialPricePurityModel = db.material_price_purities;
const MaterialPriceModel = db.material_prices;
const UnitModel = db.units;
const ProductModel = db.products;
const SubCategoryModel = db.sub_categories;


/**
 * get price info
 * 
 * @param {*} req
 * @param {*} res 
 */
 exports.productPriceInfo = async (req, res) => {
  let product = await ProductModel.findOne({ 
    where: { id: req.params.id },
    include: [
      {
        model: SubCategoryModel,
        as: 'sub_category',
      },
      {
        model: MaterialModel,
        as: 'materials',
        include: [
          {
            model: UnitModel,
            as: 'unit',
          }
        ]
      },
    ]
  });
  if (!product) {
    return res.status(errorCodes.default).send(formatErrorResponse('Product not found'));
  }

  let materialPrices = [];
  for(let i = 0; i < product.materials.length; i++){
    let data = await MaterialPriceModel.findOne({ where: { material_id: product.materials[i].id },
      include: [
        {
          model: MaterialPricePurityModel,
          as: 'materialPricePurities',
        },
      ]
    });
    if(data){
      let purities = [];
      for(let x = 0; x < data.materialPricePurities.length; x++){
        let item = data.materialPricePurities[x];
        let discounted_price = item.price - (item.mrp * item.retailer_max_discount / 100);
        purities.push({
          purity_id: item.purity_id,
          rate: item.mrp,
          discount: item.retailer_max_discount,
          discounted_price: discounted_price
        })
      }
      materialPrices.push({
        material_id: product.materials[i].id,
        purities: purities
      })
    }
  }

  let data = {
    material_prices: materialPrices,
    making_charge_type: product.sub_category.making_charge_type,
    making_charge: priceFormat(product.sub_category.making_charge),
  };
  res.send(formatResponse(data));
}
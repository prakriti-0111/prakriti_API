const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const {isEmpty, isArray, convertUnitToGram, displayAmount, getDiscountedText} = require("@helpers/helper");
const {updateOrCreate, getSuperAdminId} = require("@library/common");
const { getPaginationOptions } = require('@helpers/paginator')
const {ProductCollection} = require("@resources/sales_executive/ProductCollection");
const {ProductResource} = require("@resources/sales_executive/ProductResource");
const { Op } = require("sequelize");
const sequelize = db.sequelize;
const ProductModel = db.products;
const ProductMaterialModel = db.product_materials;
const MaterialPriceModel = db.material_prices;
const CategoryModel = db.categories;
const SubCategoryModel = db.sub_categories;
const CertificateModel = db.certificates;
const MaterialModel = db.materials;
const SizeModel = db.sizes;
const PurityModel = db.purities;
const UnitModel = db.units;
const StockModel = db.stocks;
const StockMaterialModel = db.stock_materials;
const MaterialPricePurityModel = db.material_price_purities

/**
 * Retrieve all product categories
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit } = req.query;
  let category = !isEmpty(req.query.category) ? req.query.category : '';
  let subcategory = !isEmpty(req.query.subcategory) ? req.query.subcategory : '';
  let search = !isEmpty(req.query.search) ? req.query.search : '';
  let superadminId = await getSuperAdminId();
  let conditions = {status: true};
  if(!isEmpty(search)){
    conditions.name = {[Op.like]: `%${search}%` };
  }

  const paginatorOptions = getPaginationOptions(page, limit);
  ProductModel.findAndCountAll({ 
    order:[['id', 'ASC']],
    offset: paginatorOptions.offset,
    limit: paginatorOptions.limit,
    where: conditions,
    include: [
      {
        model: CategoryModel,
        as: 'category',
        required: true,
        where: (!isEmpty(category)) ? {slug: category} : {}
      },
      {
        model: SubCategoryModel,
        as: 'sub_category',
        required: true,
        where: (!isEmpty(subcategory)) ? {slug: subcategory} : {}
      },
      {
        model: CertificateModel,
        as: 'certificate',
      },
      {
        model: MaterialModel,
        as: 'materials',
      },
      {
        model: SizeModel,
        as: 'sizes',
      },
      {
        model: StockModel,
        as: 'stocks',
        where: {user_id: superadminId},
        required: true,
        include: [
          {
            model: SizeModel,
            as: 'size'
          },
          {
            model: StockMaterialModel,
            as: 'stockMaterials',
            include:[
              {
                model: MaterialModel,
                as:'material'
              },
              {
                model: UnitModel,
                as: 'unit'
              },
              {
                model: PurityModel,
                as: 'purity'
              }
            ]
          }
        ]
      },
    ]
  }).then(async (data) => {
    let result = {
      items: await ProductCollection(data.rows),
      total: data.count,
    }
    res.send(formatResponse(result, 'Product list'));
  })
  .catch(err => {
    res.status(errorCodes.default).send(formatErrorResponse(err));
  });

  /*let stockQuery =  { 
    model: StockModel, 
    as: 'stocks',
    where: {user_id: null},
    include: [
      {
        model: StockMaterialModel,
        as: 'stockMaterials',
        include: [
          {
            model: MaterialModel,
            as: 'material',
            include: [
              {
                model: PurityModel,
                as: 'purities',
              },
            ]
          },
          {
            model: UnitModel,
            as: 'unit',
          },
          {
            model: PurityModel,
            as: 'purity',
          },
        ]
      },
   ]
  };


  let query = {
      include: [
          { 
            model: StockModel, 
            required: true ,
            as: 'stocks',
          },
          {
              model: SizeModel,
              as: 'sizes',
              include: [
                stockQuery
              ],
          },
          {
            model: CategoryModel,
            as: 'category',
            where: (!isEmpty(category)) ? {slug: category} : {}
          },
          {
            model: SubCategoryModel,
            as: 'sub_category',
            where: (!isEmpty(subcategory)) ? {slug: subcategory} : {}
          },
          {
            model: CertificateModel,
            as: 'certificate',
          },
          {
            model: MaterialModel,
            as: 'materials',
            include: [
              {
                model: UnitModel,
                as: 'unit',
              },
              {
                model: PurityModel,
                as: 'purities',
              },
              {
                model: MaterialPriceModel,
                as: 'material_price',
                include: [
                  {
                    model: MaterialPricePurityModel,
                    as: 'materialPricePurities'
                  }
                ]
              },
            ]
          },
        ]
  };

  if(!isEmpty(search)){
    query.where = {name: {[Op.like]: `%${search}%` }};
  }

  query.order = [['id', 'ASC']];
  query.offset = paginatorOptions.offset;
  query.limit =  paginatorOptions.limit;
  console.log(query)
  ProductModel.findAndCountAll(query).then(async (data) => {
    let result = {
      items: ProductCollection(data.rows),
      //total: data.count,
      total: data.rows.length,
    }
    res.send(formatResponse(result, 'All Products'));
  })
  .catch(err => {
    res.status(errorCodes.default).send(formatErrorResponse(err));
    console.log('err',err)
  });*/
};


/**
 * View Product
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.view = async (req, res) => {
  let { slug } = req.query;
  let superadminId = await getSuperAdminId();
  let product = await ProductModel.findOne({ 
    where: { slug: slug, status: true },
    include: [
      {
        model: CategoryModel,
        as: 'category',
        required: true
      },
      {
        model: SubCategoryModel,
        as: 'sub_category',
        required: true
      },
      {
        model: CertificateModel,
        as: 'certificate',
      },
      {
        model: MaterialModel,
        as: 'materials',
      },
      {
        model: SizeModel,
        as: 'sizes',
      },
      {
        model: StockModel,
        as: 'stocks',
        where: {user_id: superadminId},
        required: true,
        include: [
          {
            model: SizeModel,
            as: 'size'
          },
          {
            model: StockMaterialModel,
            as: 'stockMaterials',
            include:[
              {
                model: MaterialModel,
                as:'material'
              },
              {
                model: UnitModel,
                as: 'unit'
              },
              {
                model: PurityModel,
                as: 'purity'
              }
            ]
          }
        ]
      },
    ]
  });
  if (!product) {
    return res.status(errorCodes.default).send(formatErrorResponse('Product not found'));
  }
  res.send(formatResponse(await ProductCollection(product), "Product details"));

  /*let size_id = !isEmpty(req.query.size_id) ? req.query.size_id : '';
  let product = await ProductModel.findOne({ where: { id: req.params.id },
    include: [
      {
        model: StockModel, 
        as: 'stocks',
      },
      {
        model: CategoryModel,
        as: 'category',
      },
      {
        model: SubCategoryModel,
        as: 'sub_category',
      },
      {
        model: CertificateModel,
        as: 'certificate',
      },
      {
        model: MaterialModel,
        as: 'materials',
        include: [
          {
            model: UnitModel,
            as: 'unit',
          },
          {
            model: MaterialPriceModel,
            as: 'material_price',
            include: [
              {
                model: MaterialPricePurityModel,
                as: 'materialPricePurities'
              }
            ]
          },
        ]
      },
      {
        model: SizeModel,
        as: 'sizes',
        where: (!isEmpty(size_id)) ? {id: size_id} : {},
        include: [
          { 
            model: StockModel, 
            as: 'stocks',
            where: {product_id: req.params.id, user_id: null},
            include: [
              {
                model: StockMaterialModel,
                as: 'stockMaterials',
                include: [
                  {
                    model: MaterialModel,
                    as: 'material',
                    include: [
                      {
                        model: PurityModel,
                        as: 'purities',
                      },
                    ]
                  },
                  {
                    model: UnitModel,
                    as: 'unit',
                  },
                  {
                    model: PurityModel,
                    as: 'purity',
                  },
                ]
              },
              {
                model: ProductModel,
                as: 'product',
              },
              {
                model: SizeModel,
                as: 'size',
              },
           ]
          }
        ],
      },
      
    ]
  });
  if (!product) {
    return res.status(errorCodes.default).send(formatErrorResponse('Product not found'));
  }
  res.send(formatResponse(ProductResource(product), "Product details"));*/
};


/**
 * get price info
 * 
 * @param {*} req
 * @param {*} res 
 */
 exports.productPriceInfo = async (req, res) => {
  let data = req.body;

  let materialPrices = {
        price: 0,
        sale_price: 0,
        discount: 0,
        making_charge: 0,
        display_price: '',
        display_sale_price: '',
        display_discount: '',
        display_making_charge: '',
  };
  let stock_id = data.stock_id;


  let stock = await StockModel.findOne({ 
     where:{
      id: stock_id
     }
  });

  if (!stock) {
    return res.status(errorCodes.default).send(formatErrorResponse('Stock not found'));
  }


  let product_id = stock.product_id;

  let product = await ProductModel.findOne({ 
      where: { 
        id: product_id 
      },
    include: [
      {
        model: StockModel, 
        as: 'stocks',
      },
      {
        model: CategoryModel,
        as: 'category',
      },
      {
        model: SubCategoryModel,
        as: 'sub_category',
      },
    ]
  });

  let stock_materials = await StockMaterialModel.findAll({ 
    where:{
      stock_id: stock_id
    }
  });

  let making_charge = '';
  let making_charge_type = ''; 

  if(product && product.sub_category){ 
    making_charge = product.sub_category.making_charge;
    making_charge_type = product.sub_category.making_charge_type;

    if(!isEmpty(making_charge) && !isEmpty(making_charge_type)){
        let total_quantity = 0;
        let total_weight = 0;

      for(let i = 0; i < stock_materials.length; i++){
        total_quantity += !isEmpty(stock_materials[i]['quantity']) ? parseInt(stock_materials[i]['quantity']) : 0;
        total_weight += !isEmpty(stock_materials[i]['weight']) ? parseFloat(stock_materials[i]['weight']) : 0;
      }

      if(making_charge_type == 'per_gram' && total_weight > 0){
        materialPrices.making_charge = total_weight * making_charge;
        materialPrices.display_making_charge = displayAmount(materialPrices.making_charge);
      }

      else if(making_charge_type == 'per_piece' && total_quantity > 0){
        materialPrices.making_charge = total_quantity * making_charge;
        materialPrices.display_making_charge = displayAmount(materialPrices.making_charge);
      }
    }
  }


  let size_id = stock.size_id;
  let stock_material = await StockMaterialModel.findOne({ 
      where:{
        stock_id: stock_id
      }
  });

  let material_id = !isEmpty(stock_material) ? stock_material.material_id: null;
  let purity_id = !isEmpty(stock_material) ? stock_material.purity_id: null;
  let unit_id = !isEmpty(stock_material) ? stock_material.unit_id: null;
  let weight =  !isEmpty(stock_material) ? stock_material.weight: null;

  let product_materials = await ProductMaterialModel.findOne({ 
    where:{
      product_id: product_id,
      material_id: material_id
    }
  });

  if(product_materials){
    let material_price = await MaterialPriceModel.findOne({ where: { material_id: material_id },
      include: [
        {
          model: MaterialPricePurityModel,
          as: 'materialPricePurities',
          where: {purity_id: purity_id}
        },
      ]
    });

    let unit = await UnitModel.findOne({ where: { id: unit_id }});
    let unit_name = !isEmpty(unit) ? unit.name : '';
    let size = await SizeModel.findOne({ where: { id: size_id }});
    let size_name = !isEmpty(size) ? size.name : '';

    if(weight){
      weight = convertUnitToGram(unit_name, weight);
    }
  
    if(material_price && size_name && unit && weight && unit_name){
      for(let j = 0; j < material_price.materialPricePurities.length; j++){
        let item = material_price.materialPricePurities[j];
       
        if(!isEmpty(item.mrp)){
          let price = item.mrp * weight; 
          let original_price_per_gram = item.price - (item.mrp * item.customer_discount / 100);
          let total_price = original_price_per_gram * weight;
          materialPrices.sale_price += parseFloat(total_price);
          materialPrices.price += parseFloat(total_price);
        }
      }

      materialPrices.display_price = (materialPrices.price > 0) ? displayAmount(materialPrices.price) : '';
      materialPrices.display_sale_price = (materialPrices.sale_price > 0) ? displayAmount(materialPrices.sale_price) : '';
      materialPrices.display_discount = (materialPrices.discount > 0) ? getDiscountedText(materialPrices.discount, 'percent') : '';
      materialPrices.discount = (materialPrices.discount > 0) ? displayAmount(materialPrices.discount) : '';
    }
  } 

  res.send(formatResponse(materialPrices));
 }


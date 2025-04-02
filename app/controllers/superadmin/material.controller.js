const config = require("@config/auth.config");
const { isEmpty } = require("@helpers/helper");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { Op } = require("sequelize");
const { getPaginationOptions } = require('@helpers/paginator')
const {updateOrCreate} = require("@library/common");
const {MaterialCollection} = require("@resources/superadmin/MaterialCollection");
const sequelize = db.sequelize;
const MaterialModel = db.materials;
const MaterialPurityModel = db.material_purities;
const CategoryModel = db.categories;
const PurityModel = db.purities;
const UnitModel = db.units;
const ProductMaterialModel = db.product_materials;
const MaterialPricePurityModel = db.material_price_purities;
const MaterialPriceModel = db.material_prices;

/**
 * Retrieve all Materials
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, all, category_id, search } = req.query;
  let conditions = {};
  if(!isEmpty(category_id)){
    conditions.category_id = category_id;
  }
  if(!isEmpty(search)){
    conditions.name = {[Op.like]: `%${search}%` };
  }

  if(all == 1){
    MaterialModel.findAll({
      // order:[['name', 'DESC']],
      where: conditions,
      include: [
        {
          model: CategoryModel,
          as: 'category',
        },
        {
          model: UnitModel,
          as: 'unit',
        },
        {
          model: PurityModel,
          as: 'purities',
        }
      ]
    }).then(async (data) => {
      let result = {
        items: await MaterialCollection(data),
        total: data.length
      }
      res.send(formatResponse(result, 'Materials --1'));
    })
    .catch(err => {
      res.status(errorCodes.default).send(formatErrorResponse(err));
    });
  }else{

    const paginatorOptions = getPaginationOptions(page, limit);
    MaterialModel.findAndCountAll({ 
        // order:[['id', 'ASC']],
        where: conditions,
        offset: paginatorOptions.offset,
        limit: paginatorOptions.limit,
        include: [
          {
            model: CategoryModel,
            as: 'category',
          },
          {
            model: UnitModel,
            as: 'unit',
          },
          {
            model: PurityModel,
            as: 'purities',
          }
        ],
        distinct: true
      }).then(async (data) => {
        let result = {
          items: await MaterialCollection(data.rows),
          total: data.count,
        }
        res.send(formatResponse(result, 'Materials ---2'));
      })
      .catch(err => {
        res.status(errorCodes.default).send(formatErrorResponse(err));
      });

  }
};
    

/**
 * Create Material
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
  let data = req.body;
  
  //make unique
  let material = await MaterialModel.findOne({where: {name: data.name, category_id: data.category_id}});
  if(material){
    return res.status(errorCodes.default).send(formatErrorResponse('Name already in use.'));
  }

    
    const postData = {
      category_id: data.category_id,
      name: data.name,
      unit_id: !isEmpty(data.unit_id) ? data.unit_id : null,
      status: data.status
    };

    try{
      let material_id = 0;
        const trans = await sequelize.transaction(async (t) => {
          let material = await MaterialModel.create(postData, { transaction: t });

          if(data.purities.length > 0){
            for(let i = 0; i < data.purities.length; i++){
                let mObject = {
                  material_id: material.id,
                  purity_id: data.purities[i]
                }
                await MaterialPurityModel.create(mObject, { transaction: t });
            }
          }
          
          material_id = material.id;
          
      });

      let material = await MaterialModel.findOne({
        where: {id: material_id},
        include: [
          {
            model: CategoryModel,
            as: 'category',
          },
          {
            model: UnitModel,
            as: 'unit',
          },
          {
            model: PurityModel,
            as: 'purities',
          }
        ] 
      })

      res.send(formatResponse(await MaterialCollection(material), "Material created successfully!"));

    }catch (error) { 
      return res.status(errorCodes.default).send(formatErrorResponse('Material does not created due to some error'));
    }
};


/**
 * View Material
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.fetch = async (req, res) => {
  let material = await MaterialModel.findOne({ where: { id: req.params.id },
    include: [
      {
        model: CategoryModel,
        as: 'category',
      },
      {
        model: UnitModel,
        as: 'unit',
      },
      {
        model: PurityModel,
        as: 'purities',
      }
  ] });
  if (!material) {
    return res.status(errorCodes.default).send(formatErrorResponse('Material not found'));
  }
  res.send(formatResponse(await MaterialCollection(material), "Material fetched successfully!"));
};



/**
 * Update Material
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.update = async (req, res) => {
    let data = req.body;
    let material = await MaterialModel.findOne({ where: { id: req.params.id } });
    if (!material) {
      return res.status(errorCodes.default).send(formatErrorResponse('Material not found'));
    }

    //make unique
    material = await MaterialModel.findOne({where: {name: data.name, category_id: data.category_id, id:{ [Op.not]: req.params.id }}});
    if(material){
      return res.status(errorCodes.default).send(formatErrorResponse('Name already in use.'));
    }

    let purities = [];
    if(data.purities.length > 0){
      for(let i = 0; i < data.purities.length; i++){
        let mObject = {
          material_id: req.params.id,
          purity_id: data.purities[i]
        }
        let result = await updateOrCreate(MaterialPurityModel, mObject, mObject);
        purities.push(data.purities[i]);
      }
    }

    await MaterialPurityModel.destroy({ where: {material_id: req.params.id, purity_id: {[Op.notIn]: purities} } });

    /**
     * remove purity from material price
     */
    let materialprice = await MaterialPriceModel.findOne({where: {material_id: req.params.id}});
    if(materialprice){
      await MaterialPricePurityModel.destroy({ where: {material_price_id: materialprice.id, purity_id: {[Op.notIn]: purities} } });
    }

    const postData = {
      category_id: data.category_id,
      name: data.name,
      unit_id: !isEmpty(data.unit_id) ? data.unit_id : null,
      status: data.status
    };
    MaterialModel.update(postData, { where: { id: req.params.id } }).then(async(result) => {
      res.send(formatResponse(await MaterialCollection(data), "Material updated successfully!"));
    });
};



  
/**
 * delete Material
 * 
 * @param {*} req
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  let productMaterial = await ProductMaterialModel.findOne({where: {material_id: req.params.id}});
  if(productMaterial){
    return res.status(errorCodes.default).send(formatErrorResponse('This material is exists in product.'));
  }
  try {
    const trans = await sequelize.transaction(async (t) => {
      await MaterialPurityModel.destroy({ where: { material_id: req.params.id }, transaction: t});
      await MaterialModel.destroy({ where: { id: req.params.id }, transaction: t});
      res.send(formatResponse([], "Material deleted successfully!"));
    });
  } catch (error) {
    return res.status(errorCodes.default).send(formatErrorResponse('Material does not delete due to some error'));
  }
};
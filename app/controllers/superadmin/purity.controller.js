const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const { getPaginationOptions } = require('@helpers/paginator');
const db = require("@models");
const { Op } = require("sequelize");
const { isEmpty } = require("@helpers/helper");
const {PurityCollection} = require("@resources/superadmin/PurityCollection");
const PurityModel = db.purities;
const MaterialPurityModel = db.material_purities;
const MaterialPricePurityModel = db.material_price_purities;

/**
 * Retrieve all Purities
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
    let { page, limit, all, search } = req.query;
    let conditions = {};
    if(!isEmpty(search)){
      conditions.name = {[Op.like]: `%${search}%` };
    }
    if(all == 1){
      PurityModel.findAll({ 
        order:[['name', 'ASC']],
        where: conditions
      }).then(async (data) => {
        let result = {
          items: await PurityCollection(data),
          total: data.length
        }
        res.send(formatResponse(result, 'Purities'));
      })
      .catch(err => {
        res.status(errorCodes.default).send(formatErrorResponse(err));
      });
    }else{
      const paginatorOptions = getPaginationOptions(page, limit);
      PurityModel.findAndCountAll({ 
          order:[['id', 'DESC']],
          offset: paginatorOptions.offset,
          limit: paginatorOptions.limit,
          where: conditions
        }).then(async (data) => {
          let result = {
            items: await PurityCollection(data.rows),
            total: data.count,
          }
          res.send(formatResponse(result, 'Purities'));
        })
        .catch(err => {
          res.status(errorCodes.default).send(formatErrorResponse(err));
        });
      };
    }
/**
 * Create Purity
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
    let data = req.body;
  
    const postData = {
      name: data.name,
      value: data.value != ""?parseFloat(data.value).toFixed(2):""
    };
  
    PurityModel.create(postData).then(async(result) => {
      res.send(formatResponse(await PurityCollection(result), "Purity created successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('Purity does not created due to some error' + error));
    }); 
};


/**
 * Update Purity
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.update = async (req, res) => {
    let data = req.body;
    let size = await PurityModel.findOne({ where: { id: req.params.id} });
    if (!size) {
      return res.status(errorCodes.default).send(formatErrorResponse('Purity not found'));
    }
    const postData = {
      name: data.name,
      value: data.value != ""?parseFloat(data.value).toFixed(2):""
    };
    PurityModel.update(postData, { where: { id: req.params.id} }).then(async(result) => {
      res.send(formatResponse(await PurityCollection(data), "Purity updated successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('Purity does not updated due to some error' + error));
    });
};


/**
 * View Purity
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.fetch = async (req, res) => {
  let size = await PurityModel.findOne({ where: { id: req.params.id} });
  if (!size) {
    return res.status(errorCodes.default).send(formatErrorResponse('Purity not found'));
  }
  res.send(formatResponse(await PurityCollection(size), "Purity fetched successfully!"));
};

  
/**
 * delete Purity
 * 
 * @param {*} req
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  let mp = await MaterialPurityModel.findOne({where: {purity_id: req.params.id}});
  if(mp){
    return res.status(errorCodes.default).send(formatErrorResponse('This purity is exists in material.'));
  }
  let mpp = await MaterialPricePurityModel.findOne({where: {purity_id: req.params.id}});
  if(mpp){
    return res.status(errorCodes.default).send(formatErrorResponse('This purity is exists in material price.'));
  }

  PurityModel.destroy({ where: { id: req.params.id} }).then(result => {
    res.send(formatResponse("", 'Purity deleted Successfully!'));
  }).catch(error => {
    return res.status(errorCodes.default).send(formatErrorResponse(error));
  });
};
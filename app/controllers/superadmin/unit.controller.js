const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { isEmpty } = require("@helpers/helper");
const { Op } = require("sequelize");
const { getPaginationOptions } = require('@helpers/paginator')
const {UnitCollection} = require("@resources/superadmin/UnitCollection");
const UnitsModel = db.units;

/**
 * Retrieve all Unit
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
    UnitsModel.findAll({ 
      order:[['name', 'ASC']],
      where: conditions
    }).then(async (data) => {
      let result = {
        items: UnitCollection(data),
        total: data.length
      }
      res.send(formatResponse(result, 'Units'));
    })
    .catch(err => {
      res.status(errorCodes.default).send(formatErrorResponse(err));
    });
  }else{
    const paginatorOptions = getPaginationOptions(page, limit);
      UnitsModel.findAndCountAll({ 
          order:[['id', 'DESC']],
          offset: paginatorOptions.offset,
          limit: paginatorOptions.limit,
          where: conditions
        }).then(async (data) => {
          let result = {
            items: UnitCollection(data.rows),
            total: data.count,
          }
          res.send(formatResponse(result, 'Units'));
        })
        .catch(err => {
          res.status(errorCodes.default).send(formatErrorResponse(err));
        });
      };
    }

/**
 * Create Unit
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
    let data = req.body;
  
    const postData = {
      name: data.name,
      unit: data.unit,
      rate: data.rate,
      status: true
    };
  
    UnitsModel.create(postData).then(result => {
      res.send(formatResponse(UnitCollection(result), "Unit created successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('Unit does not created due to some error' + error));
    }); 
};


/**
 * View Unit
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.fetch = async (req, res) => {
  let unit = await UnitsModel.findOne({ where: { id: req.params.id } });
  if (!unit) {
    return res.status(errorCodes.default).send(formatErrorResponse('Unit not found'));
  }
  res.send(formatResponse(UnitCollection(unit), "Unit fetched successfully!"));
};



/**
 * Update Unit
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.update = async (req, res) => {
    let data = req.body;
    let unit = await UnitsModel.findOne({ where: { id: req.params.id } });
    if (!unit) {
      return res.status(errorCodes.default).send(formatErrorResponse('Unit not found'));
    }
    const postData = {
      name: data.name,
      unit: data.unit,
      rate: data.rate
    };
    UnitsModel.update(postData, { where: { id: req.params.id } }).then(result => {
      res.send(formatResponse(UnitCollection(data), "Unit updated successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('Unit does not updated due to some error' + error));
    });
};



  
/**
 * delete Unit
 * 
 * @param {*} req
 * @param {*} res 
 */
 exports.delete = async (req, res) => {
    UnitsModel.destroy({ where: { id: req.params.id } }).then(result => {
      res.send(formatResponse("", 'Unit deleted Successfully!'));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse(error));
    });
};
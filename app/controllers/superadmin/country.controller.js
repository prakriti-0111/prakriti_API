const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const { getPaginationOptions } = require('@helpers/paginator');
const db = require("@models");
const { isEmpty } = require("@helpers/helper");
const { Op } = require("sequelize");
const {CountryCollection} = require("@resources/superadmin/CountryCollection");
const CountryModel = db.countries;

/**
 * Retrieve all country
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
      CountryModel.findAll({ 
        order:[['name', 'ASC']],
        where: conditions
      }).then(async (data) => {
        let result = {
          items: CountryCollection(data),
          total: data.length
        }
        res.send(formatResponse(result, 'Countries'));
      })
      .catch(err => {
        res.status(errorCodes.default).send(formatErrorResponse(err));
      });
    }else{
      const paginatorOptions = getPaginationOptions(page, limit);
      CountryModel.findAndCountAll({ 
          order:[['id', 'DESC']],
          offset: paginatorOptions.offset,
          limit: paginatorOptions.limit,
          where: conditions
        }).then(async (data) => {
          let result = {
            items: CountryCollection(data.rows),
            total: data.count,
          }
          res.send(formatResponse(result, 'Countries'));
        })
        .catch(err => {
          res.status(errorCodes.default).send(formatErrorResponse(err));
        });
      };
    }
/**
 * Create Country
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
    let data = req.body;
  
    const postData = {
      name: data.name,
    };
  
    CountryModel.create(postData).then(result => {
      res.send(formatResponse(CountryCollection(result), "Country created successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('Country does not created due to some error' + error));
    }); 
};


/**
 * Update Country
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.update = async (req, res) => {
    let data = req.body;
    let country = await CountryModel.findOne({ where: { id: req.params.id} });
    if (!country) {
      return res.status(errorCodes.default).send(formatErrorResponse('Country not found'));
    }
    const postData = {
      name: data.name,
    };
    CountryModel.update(postData, { where: { id: req.params.id} }).then(result => {
      res.send(formatResponse(CountryCollection(data), "Country updated successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('Country does not updated due to some error' + error));
    });
};


/**
 * View Country
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.fetch = async (req, res) => {
  let country = await CountryModel.findOne({ where: { id: req.params.id} });
  if (!country) {
    return res.status(errorCodes.default).send(formatErrorResponse('Country not found'));
  }
  res.send(formatResponse(CountryCollection(country), "Country fetched successfully!"));
};

  
/**
 * delete Country
 * 
 * @param {*} req
 * @param {*} res 
 */
 exports.delete = async (req, res) => {
    CountryModel.destroy({ where: { id: req.params.id} }).then(result => {
      res.send(formatResponse("", 'Country deleted Successfully!'));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse(error));
    });
};
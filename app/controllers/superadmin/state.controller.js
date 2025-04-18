const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const { getPaginationOptions } = require('@helpers/paginator');
const { isEmpty } = require("@helpers/helper");
const db = require("@models");
const { Op } = require("sequelize");
const {StateCollection} = require("@resources/superadmin/StateCollection");
const StateModel = db.states;
const CountryModel = db.countries;

/**
 * Retrieve all states
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
    let { page, limit, all, search } = req.query;
    let country_id = !isEmpty(req.query.country_id) ? req.query.country_id : ''
    let conditions = {};
    if(!isEmpty(search)){
      conditions.name = {[Op.like]: `%${search}%` };
    }
    if(!isEmpty(country_id)){
      conditions.country_id = country_id;
    }

    if(all == 1){
      StateModel.findAll({
        order:[['name', 'ASC']],
        where: conditions
      }).then(async (data) => {
        let result = {
          items: StateCollection(data),
          total: data.length
        }
        res.send(formatResponse(result, 'States'));
      })
      .catch(err => {
        res.status(errorCodes.default).send(formatErrorResponse(err));
      });
    }else{
      const paginatorOptions = getPaginationOptions(page, limit);
      StateModel.findAndCountAll({
        order:[['id', 'DESC']],
        offset: paginatorOptions.offset,
        limit: paginatorOptions.limit,
        where: conditions,
        include: [
          {
            model: CountryModel,
            as: 'country',
          }
       ],
      }).then(async (data) => {
          let result = {
            items: StateCollection(data.rows),
            total: data.count,
          }
          res.send(formatResponse(result, 'States'));
        })
        .catch(err => {
          res.status(errorCodes.default).send(formatErrorResponse(err));
        });
      };
    }
   

/**
 * Create State
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
    let data = req.body;
  
    const postData = {
      name: data.name,
      country_id: data.country_id
    };
  
    StateModel.create(postData).then(result => {
      res.send(formatResponse(StateCollection(result), "State created successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('State does not created due to some error' + error));
    }); 
};


/**
 * Update State
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.update = async (req, res) => {
    let data = req.body;
    let state = await StateModel.findOne({ where: { id: req.params.id} });
    if (!state) {
      return res.status(errorCodes.default).send(formatErrorResponse('State not found'));
    }
    const postData = {
      name: data.name,
      country_id: data.country_id
    };
    StateModel.update(postData, { where: { id: req.params.id} }).then(result => {
      res.send(formatResponse(StateCollection(data), "State updated successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('State does not updated due to some error' + error));
    });
};


/**
 * View State
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.fetch = async (req, res) => {
  let state = await StateModel.findOne({ where: { id: req.params.id} ,
  
  include: [
          {
            model: CountryModel,
            as: 'country',
          }
    ]});
  if (!state) {
    return res.status(errorCodes.default).send(formatErrorResponse('State not found'));
  }
  res.send(formatResponse(StateCollection(state), "State fetched successfully!"));
};
  

/**
 * delete State
 * 
 * @param {*} req
 * @param {*} res 
 */
 exports.delete = async (req, res) => {
    StateModel.destroy({ where: { id: req.params.id} }).then(result => {
      res.send(formatResponse("", 'State deleted Successfully!'));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse(error));
    });
};
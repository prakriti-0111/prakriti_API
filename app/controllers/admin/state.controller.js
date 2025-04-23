const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const { getPaginationOptions } = require('@helpers/paginator');
const { isEmpty } = require("@helpers/helper");
const db = require("@models");
const {StateCollection} = require("@resources/admin/StateCollection");
const StateModel = db.states;
const CountryModel = db.countries;

/**
 * Retrieve all state
 * @param req
 * @param res
 */
 exports.index = async (req, res) => {
  let { page, limit, all } = req.query;
  let country_id = !isEmpty(req.query.country_id) ? req.query.country_id : ''

  if(all == 1){
    let query = { 
      order:[['name', 'ASC']]
    }

    if(!isEmpty(country_id)){
      query.where = {country_id: country_id};
    }
    
    StateModel.findAll(query).then(async (data) => {
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
    
    let query = { 
      order:[['id', 'ASC']],
      offset: paginatorOptions.offset,
      limit: paginatorOptions.limit,
      include: [
        {
          model: CountryModel,
          as: 'country',
        }
     ],
    };

    if(!isEmpty(country_id)){
      query.where = {country_id: country_id};
    }

    StateModel.findAndCountAll(query).then(async (data) => {
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

  
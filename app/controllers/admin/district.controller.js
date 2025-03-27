const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const { getPaginationOptions } = require('@helpers/paginator');
const { isEmpty } = require("@helpers/helper");
const db = require("@models");
const {DistrictCollection} = require("@resources/admin/DistrictCollection");
const DistrictModel = db.districts;
const StateModel = db.states;
const CountryModel = db.countries;

/**
 * Retrieve all district
 * @param req
 * @param res
 */
 exports.index = async (req, res) => {
  let { page, limit, all } = req.query;
  let state_id = !isEmpty(req.query.state_id) ? req.query.state_id : ''

  if(all == 1){
    let query = { 
      order:[['id', 'ASC']]
    };

    if(!isEmpty(state_id)){
      query.where = {state_id: state_id};
    }

    DistrictModel.findAll(query).then(async (data) => {
      let result = {
        items: DistrictCollection(data),
        total: data.length
      }
      res.send(formatResponse(result, 'Districts'));
    })
    .catch(err => {
      res.status(errorCodes.default).send(formatErrorResponse(err));
    });
  }
  else{
    const paginatorOptions = getPaginationOptions(page, limit);
    
    let query = { 
      order:[['id', 'ASC']],
      offset: paginatorOptions.offset,
      limit: paginatorOptions.limit,
      include: [
        {
          model: CountryModel,
          as: 'country',
        },
        
        {
          model: StateModel,
          as: 'state',
        }
      ],
    };

    if(!isEmpty(state_id)){
      query.where = {state_id: state_id};
    }

    DistrictModel.findAndCountAll(query).then(async (data) => {
        let result = {
          items: DistrictCollection(data.rows),
          total: data.count,
        }
        res.send(formatResponse(result, 'Districts'));
      })
      .catch(err => {
        res.status(errorCodes.default).send(formatErrorResponse(err));
      });
    };
  }
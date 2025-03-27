const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const { getPaginationOptions } = require('@helpers/paginator');
const db = require("@models");
const {CountryCollection} = require("@resources/admin/CountryCollection");
const CountryModel = db.countries;

/**
 * Retrieve all country
 * @param req
 * @param res
 */
 exports.index = async (req, res) => {
  let { page, limit, all } = req.query;
  if(all == 1){
    CountryModel.findAll({ 
      order:[['name', 'ASC']]
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
        order:[['id', 'ASC']],
        offset: paginatorOptions.offset,
        limit: paginatorOptions.limit,
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


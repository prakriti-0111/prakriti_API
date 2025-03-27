const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { isEmpty } = require("@helpers/helper");
const { Op } = require("sequelize");
const { getPaginationOptions } = require('@helpers/paginator')
const {TaxCollection} = require("@resources/superadmin/TaxCollection");
const TaxSlabModel = db.tax_slabs;
const ProductModel = db.products;

/**
 * Retrieve all taxes
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, search } = req.query;
  let conditions = {};
  if(!isEmpty(search)){
    conditions = {...conditions, [Op.or]: [{name: {[Op.like]: `%${search}%` }}, {cgst: search}, {sgst: search}, {igst: search}]};
  }

  const paginatorOptions = getPaginationOptions(page, limit);
    TaxSlabModel.findAndCountAll({ 
        order:[['id', 'DESC']],
        offset: paginatorOptions.offset,
        limit: paginatorOptions.limit,
        where: conditions
      }).then(async (data) => {
        let result = {
          items: TaxCollection(data.rows),
          total: data.count,
        }
        res.send(formatResponse(result, 'All Taxes'));
      })
      .catch(err => {
        res.status(errorCodes.default).send(formatErrorResponse(err));
      });
    };

/**
 * Create Tax
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
    let data = req.body;
  
    const postData = {
      name: data.name,
      cgst: data.cgst,
      sgst: data.sgst,
      igst: data.igst,
      status: true
    };
  
    TaxSlabModel.create(postData).then(result => {
      res.send(formatResponse(TaxCollection(result), "Tax created successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('Tax does not created due to some error' + error));
    }); 
};


/**
 * View Tax
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.fetch = async (req, res) => {
  let category = await TaxSlabModel.findOne({ where: { id: req.params.id } });
  if (!category) {
    return res.status(errorCodes.default).send(formatErrorResponse('Tax not found'));
  }
  res.send(formatResponse(TaxCollection(category), "Tax fetched successfully!"));
};



/**
 * Update Tax
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.update = async (req, res) => {
    let data = req.body;
    let category = await TaxSlabModel.findOne({ where: { id: req.params.id } });
    if (!category) {
      return res.status(errorCodes.default).send(formatErrorResponse('Tax not found'));
    }
    const postData = {
      name: data.name,
      cgst: data.cgst,
      sgst: data.sgst,
      igst: data.igst
    };
    TaxSlabModel.update(postData, { where: { id: req.params.id } }).then(result => {
      res.send(formatResponse(TaxCollection(data), "Tax updated successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('Tax does not updated due to some error' + error));
    });
};


/**
 * Delete Tax
 * 
 * @param {*} req
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  let product = await ProductModel.findOne({where: {tax_rate_id: req.params.id}});
  if(product){
    return res.status(errorCodes.default).send(formatErrorResponse('This tax is exists in product.'));
  }
  TaxSlabModel.destroy({ where: { id: req.params.id } }).then(result => {
    res.send(formatResponse("", 'Tax deleted Successfully!'));
  }).catch(error => {
    return res.status(errorCodes.default).send(formatErrorResponse(error));
  });
};
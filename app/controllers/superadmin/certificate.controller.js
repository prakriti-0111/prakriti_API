const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const { getPaginationOptions } = require('@helpers/paginator')
const { base64FileUpload, removeFile } = require('@helpers/upload');
const { isEmpty } = require("@helpers/helper");
const { Op } = require("sequelize");
const db = require("@models");
const {CertificateCollection} = require("@resources/superadmin/CertificateCollection");
const CertificateModel = db.certificates;

/**
 * Retrieve all certificates
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, search } = req.query;
  let conditions = {};
  if(!isEmpty(search)){
    conditions = {...conditions, [Op.or]: [{name: {[Op.like]: `%${search}%` }}, {website: `%${search}%`}]};
  }
  const paginatorOptions = getPaginationOptions(page, limit);
  CertificateModel.findAndCountAll({ 
      order:[['id', 'DESC']],
      offset: paginatorOptions.offset,
      limit: paginatorOptions.limit,
      where: conditions
    }).then(async (data) => {
      let result = {
        items: CertificateCollection(data.rows),
        total: data.count,
      }
      res.send(formatResponse(result, 'Certificates'));
    })
    .catch(err => {
      res.status(errorCodes.default).send(formatErrorResponse(err));
    });
};

/**
 * Create Certificate
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
    let data = req.body;

    //upload logo
    let logo = null;
    let result = base64FileUpload(data.logo, 'certificates');
    if(result){
      logo = result.path;
    }
    let website = (data.website.indexOf('://') === -1) ? 'https://' + data.website : data.website;
  
    const postData = {
      name: data.name,
      website: website,
      description: data.description || null,
      certificate_no: data.certificate_no || null,
      status: data.status,
      logo: logo
    };
  
    CertificateModel.create(postData).then(result => {
      res.send(formatResponse(CertificateCollection(result), "Certificate created successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('Certificate does not created due to some error' + error));
    }); 
};


/**
 * View Certificate
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.fetch = async (req, res) => {
  let certificate = await CertificateModel.findOne({ where: { id: req.params.id} });
  if (!certificate) {
    return res.status(errorCodes.default).send(formatErrorResponse('Certificate not found'));
  }
  res.send(formatResponse(CertificateCollection(certificate), "Certificate fetched successfully!"));
};



/**
 * Update Certificate
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.update = async (req, res) => {
    let data = req.body; 
    let certificate = await CertificateModel.findOne({ where: { id: req.params.id} });
    if (!certificate) {
      return res.status(errorCodes.default).send(formatErrorResponse('Certificate not found'));
    }

    let website = (data.website.indexOf('://') === -1) ? 'https://' + data.website : data.website;
    const postData = {
      name: data.name,
      website: website,
      description: data.description || null,
      certificate_no: data.certificate_no || null,
      status: data.status,
    };

    //upload logo
    if(data.remove_logo && !isEmpty(certificate.logo)){
        removeFile(certificate.logo);
        postData.logo = data.logo;
    }

    if(!isEmpty(data.logo)){
      removeFile(certificate.logo);
      let result2 = base64FileUpload(data.logo, 'certificates');
      if(result2){
        postData.logo = result2.path;
      }
    }

    CertificateModel.update(postData, { where: { id: req.params.id} }).then(result => {
      res.send(formatResponse(CertificateCollection(data), "Certificate updated successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('Certificate does not updated due to some error' + error));
    });
};



  
/**
 * Delete Certificate
 * 
 * @param {*} req
 * @param {*} res 
 */
 exports.delete = async (req, res) => {
  let certificate = await CertificateModel.findOne({ where: { id: req.params.id} });

  if(certificate && !isEmpty(certificate.logo)){
    removeFile(certificate.logo);
  }

  CertificateModel.destroy({ where: { id: req.params.id} }).then(result => {
    res.send(formatResponse("", 'Certificate deleted Successfully!'));
  }).catch(error => {
    return res.status(errorCodes.default).send(formatErrorResponse(error));
  });
};
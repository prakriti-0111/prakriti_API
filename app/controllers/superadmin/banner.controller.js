const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { Op } = require("sequelize");
const { getPaginationOptions } = require('@helpers/paginator')
const { convertToSlug, isEmpty } = require("@helpers/helper");
const {BannerCollection} = require("@resources/superadmin/BannerCollection");
const BannerModel = db.banners;
const { base64FileUpload, removeFile } = require('@helpers/upload');

/**
 * Retrieve all banners
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, all, search } = req.query;
  let conditions = {};
  const paginatorOptions = getPaginationOptions(page, limit);
  BannerModel.findAndCountAll({ 
    order:[['id', 'DESC']],
    offset: paginatorOptions.offset,
    limit: paginatorOptions.limit,
    where: conditions
  }).then(async (data) => {
    let result = {
      items: BannerCollection(data.rows),
      total: data.count,
    }
    res.send(formatResponse(result, 'banners'));
  })
  .catch(err => {
    res.status(errorCodes.default).send(formatErrorResponse(err));
  });
}

/**
 * Create banner
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
  let data = req.body;

  //upload image
  let image = null;
  let result = base64FileUpload(data.image, 'banners');
  if(result){
    image = result.path;
  }

  const postData = {
    title: data.title,
    url: data.url,
    sort_by: 999,
    image: image
  };

  BannerModel.create(postData).then(result => {
    res.send(formatResponse('', "Banner created successfully!"));
  }).catch(error => {
    return res.status(errorCodes.default).send(formatErrorResponse(error.toString()));
  }); 
};


/**
 * View Bannerr
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.fetch = async (req, res) => {
  let banner = await BannerModel.findOne({ where: { id: req.params.id } });
  if (!banner) {
    return res.status(errorCodes.default).send(formatErrorResponse('Banner not found'));
  }
  res.send(formatResponse(BannerCollection(banner)));
};



/**
 * Update Banner
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.update = async (req, res) => {
  let data = req.body;
  let banner = await BannerModel.findOne({ where: { id: req.params.id } });
  if (!banner) {
    return res.status(errorCodes.default).send(formatErrorResponse('Banner not found'));
  }
  const postData = {
    title: data.title,
    url: data.url
  };

  if(!isEmpty(data.image)){
    removeFile(banner.image);
    let result2 = base64FileUpload(data.image, 'banners');
    if(result2){
      postData.image = result2.path;
    }
  }

  BannerModel.update(postData, { where: { id: req.params.id } }).then(result => {
    res.send(formatResponse('', "Banner updated successfully!"));
  }).catch(error => {
    return res.status(errorCodes.default).send(formatErrorResponse(errorCodes.defaultErrorMsg));
  });
};



  
/**
 * delete Banner
 * 
 * @param {*} req
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  let banner = await BannerModel.findOne({ where: { id: req.params.id} });

  if(banner){
    if(!isEmpty(banner.image)){
      removeFile(banner.image);
    }
  }
  
  BannerModel.destroy({ where: { id: req.params.id } }).then(result => {
    res.send(formatResponse("", 'Banner deleted Successfully!'));
  }).catch(error => {
    return res.status(errorCodes.default).send(formatErrorResponse(errorCodes.defaultErrorMsg));
  });
};
const config = require("@config/auth.config");
const {
  errorCodes,
  formatErrorResponse,
  formatResponse,
} = require("@utils/response.config");
const db = require("@models");
const { Op } = require("sequelize");
const { getPaginationOptions } = require("@helpers/paginator");
const { convertToSlug, isEmpty } = require("@helpers/helper");
const {
  HomepageSettingCollection,
} = require("@resources/superadmin/HomepageSettingCollection");
const HomepageSettingModel = db.homepage_settings;
const { base64FileUpload, removeFile } = require("@helpers/upload");

/**
 * Retrieve all homepage_settings
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, all, search } = req.query;
  let conditions = {};
  //const paginatorOptions = getPaginationOptions(page, limit);
  HomepageSettingModel.findAndCountAll({
    order: [["order", "ASC"]],
    //offset: paginatorOptions.offset,
    //limit: paginatorOptions.limit,
    where: conditions,
  })
    .then(async (data) => {
      let result = {
        items: HomepageSettingCollection(data.rows),
        total: data.count,
      };
      res.send(formatResponse(result, "homepage_settings"));
    })
    .catch((err) => {
      res.status(errorCodes.default).send(formatErrorResponse(err));
    });
};

/**
 * Create new arrival
 *
 * @param {*} req
 * @param {*} res
 */
exports.store = async (req, res) => {
  let data = req.body;
};

/**
 * View new arrivals
 *
 * @param {*} req
 * @param {*} res
 */
exports.fetch = async (req, res) => {
  let setting = await HomepageSettingModel.findOne({ where: { id: req.params.id } });
  if (!setting) {
    return res
      .status(errorCodes.default)
      .send(formatErrorResponse("Home page setting not found"));
  }
  //res.send(formatResponse(HomepageSettingCollection(banner)));
};

/**
 * Update new arrival
 *
 * @param {*} req
 * @param {*} res
 */
exports.update = async (req, res) => {
  let data = req.body;
  compactLog("data", data);
  let settings = await HomepageSettingModel.findAll({ order: [["order", "ASC"]] });
  if (!settings) {
    return res
      .status(errorCodes.default)
      .send(formatErrorResponse("home page settings not found"));
  }

  // loop through each setting and update the order
  for (let i = 0; i < settings.length; i++) {
    let setting = settings[i];
    let postItem = data[i];
    postItem.order = parseInt(postItem.order);
    postItem.is_active = postItem.is_active == true ? 1 : 0;  
    compactLog("postItem", postItem);
    compactLog({ order: postItem.order, is_active: postItem.is_active == true ? 1 : 0 });
    compactLog({ where: { id: setting.id } });
    await HomepageSettingModel.update(
      { order: postItem.order, is_active: postItem.is_active },
      { where: { id: setting.id } }
    ).then((result) => {
      //res.send(formatResponse("", "New arrival banner updated successfully!"));
    })
    .catch((error) => {
      return res
        .status(errorCodes.default)
        .send(formatErrorResponse(errorCodes.defaultErrorMsg));
    });;
  }

  res.send(formatResponse("", "Home page settings updated successfully!"));
};

/**
 * delete new arrival
 *
 * @param {*} req
 * @param {*} res
 */
exports.delete = async (req, res) => {
  let setting = await HomepageSettingModel.findOne({ where: { id: req.params.id } });
};

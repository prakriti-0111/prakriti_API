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
  NewArrivalCollection,
} = require("@resources/superadmin/NewArrivalCollection");
const NewArrivalModel = db.new_arrivals;
const { base64FileUpload, removeFile } = require("@helpers/upload");

/**
 * Retrieve all new_arrivals
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, all, search } = req.query;
  let conditions = {};
  const paginatorOptions = getPaginationOptions(page, limit);
  NewArrivalModel.findAndCountAll({
    order: [["id", "DESC"]],
    offset: paginatorOptions.offset,
    limit: paginatorOptions.limit,
    where: conditions,
  })
    .then(async (data) => {
      let result = {
        items: NewArrivalCollection(data.rows),
        total: data.count,
      };
      res.send(formatResponse(result, "new_arrivals"));
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

  //upload image
  let image = null;
  let result = await base64FileUpload(data.image, "banners");
  if (result) {
    image = result.path;
  }

  const postData = {
    title: data.title,
    url: data.url,
    sort_by: 999,
    image: image,
  };

  NewArrivalModel.create(postData)
    .then((result) => {
      res.send(formatResponse("", "New arrival banner created successfully!"));
    })
    .catch((error) => {
      return res
        .status(errorCodes.default)
        .send(formatErrorResponse(error.toString()));
    });
};

/**
 * View new arrivals
 *
 * @param {*} req
 * @param {*} res
 */
exports.fetch = async (req, res) => {
  let banner = await NewArrivalModel.findOne({ where: { id: req.params.id } });
  if (!banner) {
    return res
      .status(errorCodes.default)
      .send(formatErrorResponse("New arrival banner not found"));
  }
  res.send(formatResponse(NewArrivalCollection(banner)));
};

/**
 * Update new arrival
 *
 * @param {*} req
 * @param {*} res
 */
exports.update = async (req, res) => {
  let data = req.body;
  let banner = await NewArrivalModel.findOne({ where: { id: req.params.id } });
  if (!banner) {
    return res
      .status(errorCodes.default)
      .send(formatErrorResponse("New arrival banner not found"));
  }
  const postData = {
    title: data.title,
    url: data.url,
  };

  if (!isEmpty(data.image)) {
    removeFile(banner.image);
    let result2 = await base64FileUpload(data.image, "banners");
    if (result2) {
      postData.image = result2.path;
    }
  }

  NewArrivalModel.update(postData, { where: { id: req.params.id } })
    .then((result) => {
      res.send(formatResponse("", "New arrival banner updated successfully!"));
    })
    .catch((error) => {
      return res
        .status(errorCodes.default)
        .send(formatErrorResponse(errorCodes.defaultErrorMsg));
    });
};

/**
 * delete new arrival
 *
 * @param {*} req
 * @param {*} res
 */
exports.delete = async (req, res) => {
  let banner = await NewArrivalModel.findOne({ where: { id: req.params.id } });

  if (banner) {
    if (!isEmpty(banner.image)) {
      removeFile(banner.image);
    }
  }

  NewArrivalModel.destroy({ where: { id: req.params.id } })
    .then((result) => {
      res.send(formatResponse("", "New arrival banner deleted successfully!"));
    })
    .catch((error) => {
      return res
        .status(errorCodes.default)
        .send(formatErrorResponse(errorCodes.defaultErrorMsg));
    });
};

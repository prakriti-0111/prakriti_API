const config = require("@config/auth.config");
const {
  errorCodes,
  formatErrorResponse,
  formatResponse,
} = require("@utils/response.config");
const db = require("@models");
const { Op } = require("sequelize");
const moment = require("moment");
const { getPaginationOptions } = require("@helpers/paginator");
const { isEmpty } = require("@helpers/helper");
const {
  StockProductSliderCollection,
} = require("@resources/superadmin/StockProductSliderCollection");
const StockProductSliderModel = db.stock_products_slider;
const CategoryModel = db.categories;
const SubCategoryModel = db.sub_categories;
const { base64FileUpload, removeFile } = require("@helpers/upload");

/**
 * Retrieve all stockproducts
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, all, search } = req.query;
  let conditions = {};
  const paginatorOptions = getPaginationOptions(page, limit);
  StockProductSliderModel.findAndCountAll({
    order: [["id", "DESC"]],
    offset: paginatorOptions.offset,
    limit: paginatorOptions.limit,
    where: conditions,
    include: [
      {
        model: CategoryModel,
        as: "category",
        required: true,
      },
      {
        model: SubCategoryModel,
        as: "sub_category",
        //required: true
      },
    ],
  })
    .then(async (data) => {
      let result = {
        items: await StockProductSliderCollection(data.rows),
        total: data.count,
      };
      res.send(formatResponse(result));
    })
    .catch((err) => {
      res.status(errorCodes.default).send(formatErrorResponse(err));
    });
};

/**
 * Create stockproduct
 *
 * @param {*} req
 * @param {*} res
 */
exports.store = async (req, res) => {
  let data = req.body;

  //upload banner
  let banner = null;
  let result = await base64FileUpload(data.banner, "banners");
  if (result) {
    banner = result.path;
  }

  const postData = {
    category_id: data.category_id,
    sub_category_id: data.sub_category_id || null,
    products: data.products.join(","),
    title: data.title,
    description: data.description,
    price: data.price,
    discount: data.discount,
    final_price: data.final_price,
    button_txt: data.button_txt,
    status: data.status,
    banner: banner
  };

  StockProductSliderModel.create(postData)
    .then((result) => {
      res.send(formatResponse("", "stock product banner created successfully!"));
    })
    .catch((error) => {
      return res
        .status(errorCodes.default)
        .send(formatErrorResponse(error.toString()));
    });
};

/**
 * View stockproduct
 *
 * @param {*} req
 * @param {*} res
 */
exports.fetch = async (req, res) => {
  let stockproduct = await StockProductSliderModel.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: CategoryModel,
        as: "category",
        required: true,
      },
      {
        model: SubCategoryModel,
        as: "sub_category",
        //required: true
      },
    ],
  });
  if (!stockproduct) {
    return res
      .status(errorCodes.default)
      .send(formatErrorResponse("stock product banner not found"));
  }
  res.send(formatResponse(await StockProductSliderCollection(stockproduct)));
};

/**
 * Update stockproduct
 *
 * @param {*} req
 * @param {*} res
 */
exports.update = async (req, res) => {
  let data = req.body;
  let stockproduct = await StockProductSliderModel.findOne({
    where: { id: req.params.id },
  });
  if (!stockproduct) {
    return res
      .status(errorCodes.default)
      .send(formatErrorResponse("stock product banner not found"));
  }

  const postData = {
    category_id: data.category_id,
    sub_category_id: data.sub_category_id || null,
    products: data.products.join(","),
    title: data.title,
    description: data.description,
    price: data.price,
    discount: data.discount,
    final_price: data.final_price,
    button_txt: data.button_txt,
    status: data.status,
    //banner: banner
  };

  if (!isEmpty(data.banner)) {
    removeFile(stockproduct.banner);
    let result2 = await base64FileUpload(data.banner, "banners");
    console.log("result2 : ", result2);
    if (result2) {
      postData.banner = result2.path;
    }
  }

  StockProductSliderModel.update(postData, { where: { id: req.params.id } })
    .then((result) => {
      res.send(formatResponse("", "stock product banner updated successfully!"));
    })
    .catch((error) => {
      return res
        .status(errorCodes.default)
        .send(formatErrorResponse(errorCodes.defaultErrorMsg));
    });
};

/**
 * delete stockproduct
 *
 * @param {*} req
 * @param {*} res
 */
exports.delete = async (req, res) => {
  let stockproduct = await StockProductSliderModel.findOne({
    where: { id: req.params.id },
  });
  if (!stockproduct) {
    return res
      .status(errorCodes.default)
      .send(formatErrorResponse("stock product banner not found"));
  }

  if (stockproduct) {
    if (!isEmpty(stockproduct.banner)) {
      removeFile(stockproduct.banner);
    }
  }

  StockProductSliderModel.destroy({ where: { id: req.params.id } })
    .then((result) => {
      res.send(formatResponse("", "stock product banner deleted successfully!"));
    })
    .catch((error) => {
      return res
        .status(errorCodes.default)
        .send(formatErrorResponse(errorCodes.defaultErrorMsg));
    });
};

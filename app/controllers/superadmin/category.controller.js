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
  CategoryCollection,
} = require("@resources/superadmin/CategoryCollection");
const CategoryModel = db.categories;
const { base64FileUpload, removeFile } = require("@helpers/upload");
const productsModel = db.products;

/**
 * Retrieve all categories
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, all, search } = req.query;
  let conditions = {};
  if (!isEmpty(search)) {
    conditions.name = { [Op.like]: `%${search}%` };
  }

  if (all == 1) {
    CategoryModel.findAll({
      order: [["name", "ASC"]],
      where: conditions,
    })
      .then(async (data) => {
        let result = {
          items: CategoryCollection(data),
          total: data.length,
        };
        res.send(formatResponse(result, "Categories"));
      })
      .catch((err) => {
        res.status(errorCodes.default).send(formatErrorResponse(err));
      });
  } else {
    const paginatorOptions = getPaginationOptions(page, limit);
    CategoryModel.findAndCountAll({
      order: [["id", "DESC"]],
      offset: paginatorOptions.offset,
      limit: paginatorOptions.limit,
      where: conditions,
    })
      .then(async (data) => {
        let result = {
          items: CategoryCollection(data.rows),
          total: data.count,
        };
        res.send(formatResponse(result, "Categories"));
      })
      .catch((err) => {
        res.status(errorCodes.default).send(formatErrorResponse(err));
      });
  }
};

/**
 * Create categories
 *
 * @param {*} req
 * @param {*} res
 */
exports.store = async (req, res) => {
  let data = req.body;

  //upload banner
  let Mobile = null;
  let result0 = await base64FileUpload(data.Mobile, "categories");
  if (result0) {
    Mobile = result0.path;
  }

  //upload banner
  let banner = null;
  let result = await base64FileUpload(data.banner, "categories");
  if (result) {
    banner = result.path;
  }

  //upload icon
  let icon = null;
  let result2 = await base64FileUpload(data.icon, "categories");
  if (result2) {
    icon = result2.path;
  }

  const postData = {
    name: data.name,
    slug: convertToSlug(data.name),
    is_material: data.is_material,
    is_ceritified: data.is_ceritified,
    status: data.status,
    front: data.front,
    Mobile: Mobile,
    banner: banner,
    icon: icon,
  };

  CategoryModel.create(postData)
    .then((result) => {
      res.send(
        formatResponse(
          CategoryCollection(result),
          "Category created successfully!"
        )
      );
    })
    .catch((error) => {
      return res
        .status(errorCodes.default)
        .send(
          formatErrorResponse(
            "Category does not created due to some error" + error
          )
        );
    });
};

/**
 * View Category
 *
 * @param {*} req
 * @param {*} res
 */
exports.fetch = async (req, res) => {
  let category = await CategoryModel.findOne({ where: { id: req.params.id } });
  if (!category) {
    return res
      .status(errorCodes.default)
      .send(formatErrorResponse("Category not found"));
  }
  res.send(
    formatResponse(
      CategoryCollection(category),
      "Category fetched successfully!"
    )
  );
};

/**
 * Update Category
 *
 * @param {*} req
 * @param {*} res
 */
exports.update = async (req, res) => {
  let data = req.body;
  let category = await CategoryModel.findOne({ where: { id: req.params.id } });
  if (!category) {
    return res
      .status(errorCodes.default)
      .send(formatErrorResponse("Category not found"));
  }
  const postData = {
    name: data.name,
    slug: convertToSlug(data.name),
    is_material: data.is_material,
    is_ceritified: data.is_ceritified,
    status: data.status,
    front: data.front,
  };

  if (!isEmpty(data.Mobile)) {
    removeFile(category.Mobile);
    let result2 = await base64FileUpload(data.Mobile, "categories");
    if (result2) {
      postData.Mobile = result2.path;
    }
  }

  if (!isEmpty(data.banner)) {
    removeFile(category.banner);
    let result2 = await base64FileUpload(data.banner, "categories");
    if (result2) {
      postData.banner = result2.path;
    }
  }

  if (!isEmpty(data.icon)) {
    removeFile(category.icon);
    let result2 = await base64FileUpload(data.icon, "categories");
    if (result2) {
      postData.icon = result2.path;
    }
  }

  CategoryModel.update(postData, { where: { id: req.params.id } })
    .then((result) => {
      res.send(
        formatResponse(
          CategoryCollection(data),
          "Category updated successfully!"
        )
      );
    })
    .catch((error) => {
      return res
        .status(errorCodes.default)
        .send(
          formatErrorResponse(
            "Category does not updated due to some error" + error
          )
        );
    });
};

/**
 * delete Category
 *
 * @param {*} req
 * @param {*} res
 */
exports.delete = async (req, res) => {
  let product = await productsModel.findOne({
    where: { category_id: req.params.id },
  });
  if (product) {
    return res
      .status(errorCodes.default)
      .send(formatErrorResponse("This category is exists in product."));
  }

  let category = await CategoryModel.findOne({ where: { id: req.params.id } });

  if (category) {
    if (!isEmpty(category.Mobile)) {
      removeFile(category.Mobile);
    }
    if (!isEmpty(category.banner)) {
      removeFile(category.banner);
    }
    if (!isEmpty(category.icon)) {
      removeFile(category.icon);
    }
  }

  CategoryModel.destroy({ where: { id: req.params.id } })
    .then((result) => {
      res.send(formatResponse("", "Category deleted Successfully!"));
    })
    .catch((error) => {
      return res.status(errorCodes.default).send(formatErrorResponse(error));
    });
};

const config = require("@config/auth.config");
const {
  errorCodes,
  formatErrorResponse,
  formatResponse,
} = require("@utils/response.config");
const db = require("@models");
const {
  base64FileUpload,
  base64VideoFileUpload,
  removeFile,
  filterFilesFromRemove,
} = require("@helpers/upload");
const {
  isEmpty,
  isArray,
  convertToSlug,
  addLog,
  convertUnitToGram,
  weightFormat,
} = require("@helpers/helper");
const { updateOrCreate } = require("@library/common");
const { getPaginationOptions } = require("@helpers/paginator");
const {
  ProductCollection,
} = require("@resources/superadmin/ProductCollection");
const {
  CategoryCollection,
} = require("@resources/superadmin/CategoryCollection");
const { Op } = require("sequelize");
const order = require("../../../models/order");
const { add } = require("lodash");
const sequelize = db.sequelize;
const UserModel = db.users;
const ProductModel = db.products;
const ProductMaterialModel = db.product_materials;
const ProductSizeModel = db.product_sizes;
const CategoryModel = db.categories;
const SubCategoryModel = db.sub_categories;
const CertificateModel = db.certificates;
const MaterialModel = db.materials;
const SizeModel = db.sizes;
const PurityModel = db.purities;
const UnitModel = db.units;
const TaxSlabModel = db.tax_slabs;
const ProductCertificateModel = db.product_certificates;
const ProductSizeMaterialModel = db.product_size_materials;
const ProductTagModel = db.product_tags;
const PurchaseProductModel = db.purchase_products;
const SaleProductModel = db.sale_products;
const StockModel = db.stocks;

/**
 * Retrieve all product categories
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, all, category_id, sub_category_id, search, purity_price } =
    req.query;
  let conditions = {};
  if (!isEmpty(category_id)) {
    //conditions.category_id = category_id;
  }
  if (!isEmpty(sub_category_id)) {
    //conditions.sub_category_id = sub_category_id;
  }
  if (!isEmpty(search)) {
    //conditions.name = {[Op.like]: `%${search}%` };
    conditions = {
      ...conditions,
      [Op.or]: [{ name: { [Op.like]: `%${search}%` } }, { weight: search }],
    };
  }

  /* check for manager/worker and other roles */
  if(![1, 2, 3, 4, 5, 6, 7, 8, 11].includes(req.role)){
    let addedBy = req.userId;
    conditions = {
      ...conditions,
      added_by: addedBy,
    };
  }

  if (all == 1) {
    ProductModel.findAll({
      order: [["name", "DESC"]],
      where: conditions,
      include: [
        {
          model: CategoryModel,
          as: "category",
          required: true,
          where: !isEmpty(category_id) ? { id: category_id } : {},
        },
        {
          model: SubCategoryModel,
          as: "sub_category",
          required: true,
          where: !isEmpty(sub_category_id) ? { id: sub_category_id } : {},
        },
        {
          model: TaxSlabModel,
          as: "tax",
        },
        /* {
          order:[['id', 'ASC']],
          model: ProductMaterialModel,
          as: 'pmaterials',
          include: [
            
          ]
        }, */
        {
          order: [["id", "ASC"]],
          model: MaterialModel,
          as: "materials",
          include: [
            {
              model: UnitModel,
              as: "unit",
            },
            {
              model: PurityModel,
              as: "purities",
            },
          ],
        },
        {
          model: SizeModel,
          as: "sizes",
        },
        {
          model: CertificateModel,
          as: "certificates",
        },
        {
          model: UserModel,
          as: "addedBy",
        },
      ],
    })
      .then(async (data) => {
        let result = {
          this: "rhaul the side ",
          items: await ProductCollection(data, { purity_price: purity_price }),
          total: data.length,
        };
        res.send(formatResponse(result, "All Products"));
      })
      .catch((err) => {
        res.status(errorCodes.default).send(formatErrorResponse(err));
      });
  } else {
    const paginatorOptions = getPaginationOptions(page, limit);
    ProductModel.findAndCountAll({
      order: [["id", "DESC"]],
      offset: paginatorOptions.offset,
      limit: paginatorOptions.limit,
      where: conditions,
      include: [
        {
          model: CategoryModel,
          as: "category",
          required: true,
          where: !isEmpty(category_id) ? { id: category_id } : {},
        },
        {
          model: SubCategoryModel,
          as: "sub_category",
          required: true,
          where: !isEmpty(sub_category_id) ? { id: sub_category_id } : {},
        },
        /*{
          model: CertificateModel,
          as: 'certificates',
        },*/
        /* {
          order:[['id', 'ASC']],
          model: ProductMaterialModel,
          as: 'pmaterials',
          include: [
            
          ]
        }, */
        {
          order: [["id", "ASC"]],
          model: MaterialModel,
          as: "materials",
          include: [
            {
              model: UnitModel,
              as: "unit",
            },
            {
              model: PurityModel,
              as: "purities",
            },
          ],
        },
        /*{
          model: SizeModel,
          as: 'sizes',
        },
        {
          model: ProductTagModel,
          as: 'tags',
        }*/
        {
          model: UserModel,
          as: "addedBy",
        },
      ],
      distinct: true,
    })
      .then(async (data) => {
        let result = {
          this: "find and count all",
          items: await ProductCollection(data.rows),
          total: data.count,
        };
        res.send(formatResponse(result, "Product Categories"));
      })
      .catch((err) => {
        res.status(errorCodes.default).send(formatErrorResponse(err));
      });
  }
};

/**
 * Get all data for product create & edit
 *
 * @param {*} req
 * @param {*} res
 */
exports.create = async (req, res) => {
  let categories = await CategoryModel.findAll({ order: [["name", "ASC"]] });
  let certificates = await CertificateModel.findAll({
    order: [["name", "ASC"]],
  });
  //let materials = await MaterialModel.findAll({ order:[['name', 'ASC']]});
  let sizes = await SizeModel.findAll({ order: [["name", "ASC"]] });

  res.send(
    formatResponse(
      {
        categories: CategoryCollection(categories),
        certificates: getFormatedData(certificates),
        //materials: getFormatedData(materials),
        sizes: getFormatedData(sizes),
      },
      "Product Categories"
    )
  );
};

const getFormatedData = (data) => {
  let arr = [];
  for (let i = 0; i < data.length; i++) {
    arr.push({
      id: data[i].id,
      name: data[i].name,
    });
  }
  return arr;
};

/**
 * Store product
 *
 * @param {*} req
 * @param {*} res
 */
exports.store = async (req, res) => {
  let data = req.body;

  let product_code = data.product_code || null;

  //make unique
  let haveCode = await ProductModel.findOne({
    where: { product_code: product_code },
  });
  if (haveCode) {
    return res
      .status(errorCodes.default)
      .send(formatErrorResponse("Product Code already in use."));
  }

  try {
    const trans = await sequelize.transaction(async (t) => {
      //upload images
      let images = [];
      for (let i = 0; i < data.images.length; i++) {
        let result = await base64FileUpload(data.images[i], "products");
        if (result) {
          images.push(result);
        }
      }

      //upload main image
      let main_image = null;
      let result = await base64FileUpload(data.main_image, "products");
      if (result) {
        main_image = result.path;
      }

      //upload video
      let video = null;
      if (!isEmpty(data.video)) {
        let result = await base64VideoFileUpload(data.video, "products");
        if (result) {
          video = result.path;
        }
      }

      //create product
      let weight = 0;
      if (data.size_materials.length) {
        for (let i = 0; i < data.size_materials[0].materials.length; i++) {
          let unit = await UnitModel.findOne({
            where: { id: data.size_materials[0].materials[i].unit_id },
          });
          weight += convertUnitToGram(
            unit.name,
            data.size_materials[0].materials[i].weight
          );
        }
        weight = weightFormat(weight);
      }
      let productData = {
        added_by: req.userId,
        category_id: data.category_id,
        sub_category_id: data.sub_category_id,
        name: data.name,
        slug: convertToSlug(data.name),
        tax_rate_id: data.tax_rate_id || null,
        product_code: product_code,
        type: data.type,
        //certificate_id: (data.type != "material") ? (data.certificate_id || null) : '',
        description: data.description || null,
        short_desc: data.short_desc || null,
        keywords: data.keywords || null,
        meta_title: data.meta_title || null,
        licence_no: data.type != "material" ? data.licence_no || null : "",
        status: data.status,
        is_featured: data.is_featured,
        certified: data.certified,
        images: images,
        main_image: main_image,
        video: video,
        weight: weight,
      };
      let product = await ProductModel.create(productData, { transaction: t });

      //create product materials
      if (data.type != "material") {
        for (let i = 0; i < data.materials.length; i++) {
          let mObject = {
            product_id: product.id,
            material_id: data.materials[i],
          };
          await ProductMaterialModel.create(mObject, { transaction: t });
        }
      } else {
        let mObject = {
          product_id: product.id,
          material_id: data.material_id,
        };
        await ProductMaterialModel.create(mObject, { transaction: t });
      }
      if (!isEmpty(data.certificates)) {
        for (let i = 0; i < data.certificates.length; i++) {
          let mObject = {
            product_id: product.id,
            certificate_id: data.certificates[i],
          };
          await ProductCertificateModel.create(mObject, { transaction: t });
        }
      }

      //create product sizes
      if (data.type != "material") {
        for (let i = 0; i < data.sizes.length; i++) {
          let sObject = {
            product_id: product.id,
            size_id: data.sizes[i],
          };
          await ProductSizeModel.create(sObject, { transaction: t });
        }
      }

      //update product code if not sent
      /*if(isEmpty(product_code)){
        if(data.type == "material"){
          product_code = 'RVM' + product.id;
        }else{
          product_code = 'RVP' + product.id;
        }
        await ProductModel.update({
          product_code: product_code
        },{where: {id: product.id}, transaction: t});
      }*/

      for (let i = 0; i < data.size_materials.length; i++) {
        for (let x = 0; x < data.size_materials[i].materials.length; x++) {
          await ProductSizeMaterialModel.create(
            {
              product_id: product.id,
              size_id: data.size_materials[i].size_id || null,
              material_id: data.size_materials[i].materials[x].material_id,
              weight: data.size_materials[i].materials[x].weight,
              unit_id: data.size_materials[i].materials[x].unit_id,
              quantity: data.size_materials[i].materials[x].quantity || 0,
              purities: data.size_materials[i].materials[x].purities.join(","),
            },
            { transaction: t }
          );
        }
      }

      for (let i = 0; i < data.tags.length; i++) {
        await ProductTagModel.create({
          product_id: product.id,
          tag: data.tags[i],
        });
      }

      res.send(formatResponse([], "Product created successfully!"));
    });
  } catch (error) {
    addLog("err: " + error.toString());
    return res
      .status(errorCodes.default)
      .send(formatErrorResponse("Product does not created due to some error"));
  }
};

/**
 * View Product
 *
 * @param {*} req
 * @param {*} res
 */
exports.view = async (req, res) => {
  let product = await ProductModel.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: CategoryModel,
        as: "category",
      },
      {
        model: SubCategoryModel,
        as: "sub_category",
      },
      {
        model: CertificateModel,
        as: "certificates",
      },
      {
        model: MaterialModel,
        as: "materials",
      },
      {
        model: SizeModel,
        as: "sizes",
      },
      {
        model: TaxSlabModel,
        as: "tax",
      },
      {
        model: ProductTagModel,
        as: "tags",
        separate: true,
      },
      {
        model: UserModel,
        as: "addedBy",
      },
    ],
  });
  if (!product) {
    return res
      .status(errorCodes.default)
      .send(formatErrorResponse("Product not found"));
  }
  res.send(formatResponse(await ProductCollection(product), "Product details"));
};

/**
 * Update Product
 *
 * @param {*} req
 * @param {*} res
 */
exports.update = async (req, res) => {
  let product = await ProductModel.findOne({ where: { id: req.params.id } });
  if (!product) {
    return res
      .status(errorCodes.default)
      .send(formatErrorResponse("Product not found"));
  }

  let data = req.body;

  //make unique
  let product_code = data.product_code || null;
  let haveCode = await ProductModel.findOne({
    where: { product_code: product_code, id: { [Op.not]: req.params.id } },
  });
  if (haveCode) {
    return res
      .status(errorCodes.default)
      .send(formatErrorResponse("Product Code already in use."));
  }

  try {
    let images = [];
    let removeFiles = isArray(data.remove_images) ? data.remove_images : [];
    let oldFiles = filterFilesFromRemove(product.images, removeFiles);
    if (!isEmpty(data.images)) {
      try {
        for (let i = 0; i < data.images.length; i++) {
          let result = await base64FileUpload(data.images[i], "products");
          if (result) {
            images.push(result);
          }
        }
      } catch (error) {}
    }
    images = [...images, ...oldFiles];

    let video = product.video;
    if (data.remove_video || !isEmpty(data.video)) {
      if (!isEmpty(product.video)) {
        let result = await removeFile(product.video);
      }
      let result2 = await base64VideoFileUpload(data.video, "products");
      if (result2) {
        video = result2.path;
      }
    }

    let main_image = product.main_image;
    if (!isEmpty(data.main_image)) {
      removeFile(product.main_image);
      let result2 = await base64FileUpload(data.main_image, "products");
      if (result2) {
        main_image = result2.path;
      }
    }

    const trans = await sequelize.transaction(async (t) => {
      /* delete last records by product_id from ProductMaterialModel */
      let deleteCount = await ProductMaterialModel.destroy({
        where: { product_id: product.id },
        transaction: t,
      });
      console.log("deleteCount : ", deleteCount);
      //create product materials
      let mIds = [],
        pcertificatesIds = [];
      if (data.type != "material") {
        for (let i = 0; i < data.materials.length; i++) {
          let mObject = {
            product_id: product.id,
            material_id: data.materials[i],
          };
          //let result = await updateOrCreate(ProductMaterialModel, mObject, mObject, t);
          let result = await ProductMaterialModel.create(mObject, {
            transaction: t,
          });
          //mIds.push(result.item.id);
          mIds.push(result.id);
        }
      } else {
        let mObject = {
          product_id: product.id,
          material_id: data.material_id,
        };
        //let result = await updateOrCreate(ProductMaterialModel, mObject, mObject, t);
        let result = await ProductMaterialModel.create(mObject, {
          transaction: t,
        });
        //mIds.push(result.item.id);
        mIds.push(result.id);
      }
      for (let i = 0; i < data.certificates.length; i++) {
        let mObject = {
          product_id: product.id,
          certificate_id: data.certificates[i],
        };
        let result = await updateOrCreate(
          ProductCertificateModel,
          mObject,
          mObject,
          t
        );
        pcertificatesIds.push(result.item.id);
      }
      console.log("mIds : ", mIds);
      //await ProductMaterialModel.destroy({ where: { id: {[Op.notIn]: mIds}, product_id: product.id}, transaction: t});
      await ProductCertificateModel.destroy({
        where: { id: { [Op.notIn]: pcertificatesIds }, product_id: product.id },
        transaction: t,
      });

      //create product sizes
      let sIds = [];
      if (data.type != "material") {
        for (let i = 0; i < data.sizes.length; i++) {
          let sObject = {
            product_id: product.id,
            size_id: data.sizes[i],
          };
          let result = await updateOrCreate(
            ProductSizeModel,
            sObject,
            sObject,
            t
          );
          sIds.push(result.item.id);
        }
      }
      await ProductSizeModel.destroy({
        where: { id: { [Op.notIn]: sIds }, product_id: product.id },
        transaction: t,
      });

      //update product code if not sent
      /*let product_code = data.product_code || null;
      if(isEmpty(product_code)){
        if(data.type == "material"){
          product_code = 'RVM' + product.id;
        }else{
          product_code = 'RVP' + product.id;
        }
      }*/

      let weight = 0;
      if (data.size_materials.length) {
        for (let i = 0; i < data.size_materials[0].materials.length; i++) {
          let unit = await UnitModel.findOne({
            where: { id: data.size_materials[0].materials[i].unit_id },
          });
          weight += convertUnitToGram(
            unit.name,
            data.size_materials[0].materials[i].weight
          );
        }
        weight = weightFormat(weight);
      }

      //update product
      let productData = {
        category_id: data.category_id,
        sub_category_id: data.sub_category_id,
        name: data.name,
        slug: convertToSlug(data.name),
        tax_rate_id: data.tax_rate_id || null,
        product_code: product_code,
        type: data.type,
        certificate_id: data.certificate_id || null,
        description: data.description || null,
        short_desc: data.short_desc || null,
        keywords: data.keywords || null,
        meta_title: data.meta_title || null,
        licence_no: data.licence_no || null,
        status: data.status,
        is_featured: data.is_featured,
        certified: data.certified,
        images: images,
        main_image: main_image,
        video: video,
        weight: weight,
      };
      await ProductModel.update(productData, {
        where: { id: product.id },
        transaction: t,
      });

      /* delete last records by product_id from ProductSizeMaterialModel  */
      await ProductSizeMaterialModel.destroy({
        where: { product_id: product.id },
        transaction: t,
      });
      let size_m_ids = [];
      for (let i = 0; i < data.size_materials.length; i++) {
        for (let x = 0; x < data.size_materials[i].materials.length; x++) {
          let whereObj = {
            product_id: product.id,
            size_id: data.size_materials[i].size_id || null,
          };
          if (data.type != "material") {
            whereObj.material_id =
              data.size_materials[i].materials[x].material_id;
          }
          let thisObj = {
            product_id: product.id,
            size_id: data.size_materials[i].size_id || null,
            material_id: data.size_materials[i].materials[x].material_id,
            weight: data.size_materials[i].materials[x].weight,
            unit_id: data.size_materials[i].materials[x].unit_id,
            quantity: data.size_materials[i].materials[x].quantity || 0,
            purities: data.size_materials[i].materials[x].purities.join(","),
          };

          //let result = await updateOrCreate(ProductSizeMaterialModel, whereObj, thisObj, t);
          let result = await ProductSizeMaterialModel.create(thisObj, {
            transaction: t,
          });
          //size_m_ids.push(result.item.id);
          size_m_ids.push(result.id);
        }
      }
      //await ProductSizeMaterialModel.destroy({ where: { id: {[Op.notIn]: size_m_ids}, product_id: product.id}, transaction: t});

      let tag_ids = [];
      for (let i = 0; i < data.tags.length; i++) {
        let result = await updateOrCreate(
          ProductTagModel,
          {
            product_id: product.id,
            tag: data.tags[i],
          },
          {
            product_id: product.id,
            tag: data.tags[i],
          },
          t
        );
        tag_ids.push(result.item.id);
      }
      await ProductTagModel.destroy({
        where: { id: { [Op.notIn]: tag_ids }, product_id: product.id },
        transaction: t,
      });

      res.send(formatResponse([], "Product updated successfully!"));
    });
  } catch (error) {
    addLog("error: " + error.toString());
    return res
      .status(errorCodes.default)
      .send(formatErrorResponse("Product does not update due to some error"));
  }
};

/**
 * delete Category
 *
 * @param {*} req
 * @param {*} res
 */
exports.delete = async (req, res) => {
  try {
    let product_id = req.params.id;
    let product = await ProductModel.findOne({ where: { id: req.params.id } });
    if (!product) {
      return res
        .status(errorCodes.default)
        .send(formatErrorResponse("Product not found"));
    }

    let purchase = await PurchaseProductModel.findOne({
      where: { product_id: req.params.id },
    });
    if (purchase) {
      return res
        .status(errorCodes.default)
        .send(formatErrorResponse("Product is in purchase. You can't delete."));
    }
    let salePro = await SaleProductModel.findOne({
      where: { product_id: req.params.id },
    });
    if (salePro) {
      return res
        .status(errorCodes.default)
        .send(formatErrorResponse("Product is in sale. You can't delete."));
    }
    let stock = await StockModel.findOne({
      where: { product_id: req.params.id },
    });
    if (stock) {
      return res
        .status(errorCodes.default)
        .send(formatErrorResponse("Product is in stock. You can't delete."));
    }

    const trans = await sequelize.transaction(async (t) => {
      await ProductSizeModel.destroy({
        where: { product_id: product_id },
        transaction: t,
      });
      await ProductMaterialModel.destroy({
        where: { product_id: product_id },
        transaction: t,
      });
      await ProductCertificateModel.destroy({
        where: { product_id: product_id },
        transaction: t,
      });
      await ProductModel.destroy({ where: { id: product_id }, transaction: t });
      await ProductSizeMaterialModel.destroy({
        where: { id: product_id },
        transaction: t,
      });

      //remove all files
      if (isArray(product.images)) {
        for (let i = 0; i < product.images.length; i++) {
          removeFile(product.images[i].path);
        }
      }

      if (!isEmpty(product.video)) {
        removeFile(product.video);
      }

      if (!isEmpty(product.main_image)) {
        removeFile(product.main_image);
      }

      res.send(formatResponse([], "Product deleted successfully!"));
    });
  } catch (error) {
    return res
      .status(errorCodes.default)
      .send(formatErrorResponse("Product does not delete due to some error"));
  }
};

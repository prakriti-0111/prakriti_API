const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const sequelize = db.sequelize;
const { Op, QueryTypes } = require("sequelize");
const { getPaginationOptions } = require('@helpers/paginator')
const { UnitCollection } = require("@resources/superadmin/UnitCollection");
const { StocksCollection } = require("@resources/superadmin/StocksCollection");
const { StocksMaterialCollection } = require("@resources/superadmin/StocksMaterialCollection");
const stocksModel = db.stocks;
const { isEmpty, priceFormat, convertUnitToGram, addLog, arrayColumn } = require("@helpers/helper");
const { getTotalStockPriceByUser, getWorkingUserID, isSuperAdmin, isAdmin, getStockUserID, isManager, updateOrCreate, getRoleId, getUserColumnValue, avlStockUserIdsNew } = require("@library/common");
const { isDistributor, isSalesExecutive } = require("../../library/common");
const productsModel = db.products;
const sizesModel = db.sizes;
const stock_materialsModel = db.stock_materials;
const materialModel = db.materials
const UnitModel = db.units;
const PurityModel = db.purities;
const TaxSlabModel = db.tax_slabs;
const SubCategoryModel = db.sub_categories;
const CategoryModel = db.categories;
const CertificateModel = db.certificates;
const PurchaseProductModel = db.purchase_products;
const PurchaseModel = db.purchases;
const UserModel = db.users;



/**
 * Retrieve all Unit
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  /**
   * Update all old stock material category_id
   */
  /*let allStocks = await stocksModel.findAll({
    include: [
      {
        model: productsModel,
        as: 'product',
        //required: true
      }
    ]
  });
  for(let i = 0; i < allStocks.length; i++){
    await stock_materialsModel.update({
      category_id: allStocks[i].product.category_id
    },{where: {stock_id: allStocks[i].id}});
  }*/

  /**
   * update stock material total gram which have null
   */
  /*let allStockMaterials = await stock_materialsModel.findAll({
    include: [
      {
        model: UnitModel,
        as: 'unit',
        required: true
      }
    ]
  });
  for(let i = 0; i < allStockMaterials.length; i++){
    let total_gram = convertUnitToGram(allStockMaterials[i].unit.name, allStockMaterials[i].weight);
    await stock_materialsModel.update({
      weight_in_gram: total_gram
    },{where: {id: allStockMaterials[i].id}});
  }*/

  //update stock purity_id which product is material
  if(req.query.search == 'update_all_stock_priority'){
    let stocksAll = await stocksModel.findAll({
      where: {type: {[Op.ne]: 'material'}},
      include: [
        {
          model: productsModel,
          as: 'product',
          required: true
        },
        {
          model: stock_materialsModel,
          as: 'stockMaterials',
          separate: true
        }
      ]
    });

    for(let i = 0; i < stocksAll.length; i++){
      // console.log("---------stocksAll----------",stocksAll[i])
      let item = stocksAll[i];
      if(item.product.type == 'material' && item.stockMaterials.length && isEmpty(item.purity_id)){
        await stocksModel.update({purity_id: item.stockMaterials[0].purity_id}, { where: { id: item.id } })
      }
    }
  }

  try {
    let { page, limit, all, category_id, sub_category_id, search, user_id, type, own_distributor, own_admin, own_se, total_avl_stock, by_specific, manager } = req.query;
    type = type === undefined ? 'product' : type;
    let userID = !user_id ? (isManager(req) ? req.userId : await getWorkingUserID(req)) : user_id;
    let conditions = { type: type };

    let superAdminRoleId = getRoleId("superadmin");
    let adminRoleId = getRoleId("admin");
    let distributorRoleId = getRoleId("distributor");
    let retailerRoleId = getRoleId("retailer");
    let supplierRoleId = getRoleId("supplier");
    let customerRoleId = getRoleId("customer");
    let sales_executiveRoleId = getRoleId("sales_executive");
    let seRoleId = getRoleId('sales_executive');
    if (isSuperAdmin(req)) {
      if (own_distributor == "1" || own_distributor == "0") {
        let thisCon = { role_id: distributorRoleId };
        if (own_distributor == "1") {
          thisCon.own = true;
        } else if (own_distributor == "0") {
          thisCon.own = false;
        }
        let distributors = await UserModel.findAll({ attributes: ['id'], where: thisCon });
        let distributorIds = arrayColumn(distributors, 'id');
        conditions.user_id = { [Op.in]: distributorIds }
      } else if (own_admin == "1" || own_admin == "0") {
        let thisCon = { role_id: adminRoleId };
        if (own_admin == "1") {
          thisCon.own = true;
        } else if (own_admin == "0") {
          thisCon.own = false;
        }
        let admins = await UserModel.findAll({ attributes: ['id'], where: thisCon });
        let adminIds = arrayColumn(admins, 'id');
        conditions.user_id = { [Op.in]: adminIds }
      } else if (total_avl_stock == 1) {
        let ownUserIds = await avlStockUserIdsNew(req, superAdminRoleId);
        //ownUserIds.push(userID);
        conditions.user_id = { [Op.in]: ownUserIds }
      } else if (manager == 1) {
        let managerUsers = await UserModel.findAll({ attributes: ['id'], where: { role_id: getRoleId('manager') } });
        let managerUsersIds = arrayColumn(managerUsers, 'id');
        conditions.user_id = { [Op.in]: managerUsersIds }
      } else if(own_se == 1){
        let se = await UserModel.findAll({ attributes: ['id'], where: { role_id: seRoleId } });
        let seIds = arrayColumn(se, 'id');
        conditions.user_id = { [Op.in]: seIds }
      }
    } else if (isAdmin(req)) {
      if (own_distributor == "1" || own_distributor == "0") {
        let state_id = await getUserColumnValue(req.userId, 'state_id');
        let thisCon = { role_id: distributorRoleId, state_id: state_id };
        if (own_distributor == "1") {
          thisCon.own = true;
        } else if (own_distributor == "0") {
          thisCon.own = false;
        }
        let distributors = await UserModel.findAll({ attributes: ['id'], where: thisCon });
        let distributorIds = arrayColumn(distributors, 'id');
        conditions.user_id = { [Op.in]: distributorIds }
      }else if(by_specific == 1 && total_avl_stock == 1){
        let ownUserIds = await avlStockUserIdsNew(req, adminRoleId);
        ownUserIds.push(userID);
        conditions.user_id = { [Op.in]: ownUserIds }
      }else if (total_avl_stock == 1) {
        let ownUserIds = await avlStockUserIdsNew(req, superAdminRoleId);
        ownUserIds.push(userID);
        conditions.user_id = { [Op.in]: ownUserIds }
      }
    } else if (isDistributor(req)) {
      if (own_se == 1) {
        let seData = await UserModel.findAll({ attributes: ['id'], where: { role_id: seRoleId, parent_id: req.userId } });
        let seIds = arrayColumn(seData, 'id');
        conditions.user_id = { [Op.in]: seIds }
      }else if(by_specific == 1 && total_avl_stock == 1){
        let ownUserIds = await avlStockUserIdsNew(req, distributorRoleId);
        ownUserIds.push(userID);
        conditions.user_id = { [Op.in]: ownUserIds }
      }else if (total_avl_stock == 1) {
        let ownUserIds = await avlStockUserIdsNew(req, superAdminRoleId);
        ownUserIds.push(userID);
        conditions.user_id = { [Op.in]: ownUserIds }
      }
    } else if(isSalesExecutive(req)){
      if(by_specific == 1 && total_avl_stock == 1){
        let ownUserIds = await avlStockUserIdsNew(req, sales_executiveRoleId);
        ownUserIds.push(userID);
        conditions.user_id = { [Op.in]: ownUserIds }
      }else if (total_avl_stock == 1) {
        let ownUserIds = await avlStockUserIdsNew(req, superAdminRoleId);
        ownUserIds.push(userID);
        conditions.user_id = { [Op.in]: ownUserIds }
      }
    }
    if (!('user_id' in conditions)) {
      conditions.user_id = await getStockUserID(req, userID);
    }
    let productConditions = {};
    let stockMaterialConditions = {};
    if (!isEmpty(category_id)) {
      productConditions.category_id = category_id;
    }
    if (!isEmpty(sub_category_id)) {
      productConditions.sub_category_id = sub_category_id;
    }
    if (!isEmpty(search)) {
      if (type == "product" || type == "return") {
      conditions = { ...conditions, [Op.or]: [{ '$product.name$': { [Op.like]: `%${search}%` } }, { certificate_no: search }, { '$product.product_code$': { [Op.like]: `%${search}%` } }, /*{ '$user.name$': { [Op.like]: `%${search}%` } }, { '$user.company_name$': { [Op.like]: `%${search}%` } }*/] };
      } else {
        conditions = { ...conditions, [Op.or]: [{ '$material.name$': { [Op.like]: `%${search}%` } }] };
      }
    }

    const paginatorOptions = getPaginationOptions(page, limit);
    let limit_offset = { offset: paginatorOptions.offset, limit: paginatorOptions.limit };
    if (all == 1) {
      limit_offset = {};
    }
    let _include = [
      {
        model: sizesModel,
        as: 'size'
      },
      {
        model: stock_materialsModel,
        as: 'stockMaterials',
        required: true,
        where: stockMaterialConditions,
        separate: true,
        include: [
          {
            model: materialModel,
            as: 'material'
          },
          {
            model: UnitModel,
            as: 'unit'
          },
          {
            model: PurityModel,
            as: 'purity'
          }
        ]
      },
      {
        model: UserModel,
        as: 'user'
      },
    ];
    if (type == "product" || type == "return") {
      _include.push({
        model: productsModel,
        as: 'product',
        required: true,
        where: productConditions,
        include: [
          {
            model: CategoryModel,
            as: 'category'
          },
          {
            model: SubCategoryModel,
            as: 'sub_category'
          },
          {
            model: CertificateModel,
            as: 'certificates',
          },
          {
            model: TaxSlabModel,
            as: 'tax'
          }
        ]
      })
    } else {
      _include.push({
        model: materialModel,
        as: 'material',
        required: true,
        where: productConditions,
        include: [
          {
            model: CategoryModel,
            as: 'category'
          }
        ]
      })
    }


    stocksModel.findAndCountAll({
      order: [['id', 'DESC']],
      where: conditions,
      ...limit_offset,
      include: _include,
      distinct: true,
      //subQuery: isEmpty(search) ? true : false,
    }).then(async (data) => {
      //
      // console.log("-------this is actual value ",data.rows[0]);
      let result = {
        items: (type == 'product' || type == 'return') ? await StocksCollection(data.rows, userID) : await StocksMaterialCollection(data.rows, userID),
        total: data.count,
      }

      // console.log(result)
      // console.log("--------------------",result,"---------------------")
      res.send(formatResponse(result, 'stocks super_admin'));
    })
      .catch(err => {
        addLog('catch error: ' + err.toString());
        console.log(err)
        res.status(errorCodes.default).send(formatErrorResponse(err));
      });
  } catch (error) {
    addLog('error: ' + error.toString());
  }
}

/**
 * View Stock
 *.
 * @param {*} req
 * @param {*} res
 */
exports.view = async (req, res) => {
  let userID = isManager(req) ? req.userId : await getWorkingUserID(req);
  let stock = await stocksModel.findOne({
    where: { user_id: await getStockUserID(req, userID), id: req.params.id },
    include: [
      {
        model: productsModel,
        as: 'product',
        include: [
          {
            model: CategoryModel,
            as: 'category'
          },
          {
            model: SubCategoryModel,
            as: 'sub_category'
          },
          {
            model: CertificateModel,
            as: 'certificates',
          }
        ]
      },
      {
        model: sizesModel,
        as: 'size'
      },
      {
        model: stock_materialsModel,
        as: 'stockMaterials',
        separate: true,
        include: [
          {
            model: materialModel,
            as: 'material'
          },
          {
            model: UnitModel,
            as: 'unit'
          },
          {
            model: PurityModel,
            as: 'purity'
          }
        ]
      },

    ]
  });

  if (!stock) {
    return res.status(errorCodes.default).send(formatErrorResponse('Stock not found'));
  }
  res.send(formatResponse(await StocksCollection(stock, userID), "Stock details"));

}


/**
 * Retrieve all products for sale
 * @param req
 * @param res
 */
exports.stockProducts = async (req, res) => {
  let { sub_category_id } = req.query;
  if (isEmpty(sub_category_id)) {
    return res.send(formatResponse([], 'Stock Products'));
  }
  let userID = await getStockUserID(req);
  let stocks = await stocksModel.findAll({
    where: { user_id: userID },
    group: ['product_id'],
    include: [
      {
        model: productsModel,
        as: 'product',
        where: { sub_category_id: sub_category_id },
        include: [
          {
            model: TaxSlabModel,
            as: 'tax'
          }
        ]
      }
    ]
  });
  let products = [];
  for (let i = 0; i < stocks.length; i++) {
    let stock = stocks[i];
    if (!isEmpty(stock.product)) {
      let taxInfo = null;
      if ('tax' in stock.product && stock.product.tax) {
        taxInfo = {
          name: stock.product.tax.name,
          cgst: parseFloat(stock.product.tax.cgst),
          sgst: parseFloat(stock.product.tax.sgst),
          igst: parseFloat(stock.product.tax.igst),
        }
      }

      products.push({
        name: stock.product.name,
        id: stock.product.id,
        type: stock.product.type,
        tax_info: taxInfo
      });
    }

  }

  res.send(formatResponse(products, 'Stock Products'));
}

/**
 * Retrieve stock product details
 * @param req
 * @param res
 */
exports.stockProductDetails = async (req, res) => {
  let userID = await getStockUserID(req);
  let stocks = await stocksModel.findAll({
    where: { user_id: userID, product_id: req.query.product_id },
    include: [
      {
        model: productsModel,
        as: 'product'
      },
      {
        model: sizesModel,
        as: 'size'
      },
      {
        model: stock_materialsModel,
        as: 'stockMaterials',
        separate: true,
        include: [
          {
            model: materialModel,
            as: 'material'
          },
          {
            model: UnitModel,
            as: 'unit'
          },
          {
            model: PurityModel,
            as: 'purity'
          }
        ]
      },

    ]
  });

  let products = [];
  for (let i = 0; i < stocks.length; i++) {
    let stock = stocks[i];
    if (!isEmpty(stock.product)) {
      let thisObj = {
        stock_id: stock.id,
        product_name: stock.product.name,
        product_type: stock.product.type,
        product_id: stock.product.id,
        size_id: stock.size_id,
        size_name: stock.size ? stock.size.name : '',
        certificate_no: stock.certificate_no
      }
      let materials = [];
      for (let x = 0; x < stock.stockMaterials.length; x++) {
        let stockM = stock.stockMaterials[x];
        let thisMObj = {
          material_id: stockM.material_id,
          weight: stockM.weight,
          quantity: stockM.quantity,
          material_name: stockM.material ? stockM.material.name : '',
          unit_id: stockM.unit_id,
          unit_name: (stockM.unit) ? stockM.unit.name : '',
          purity: stockM.purity ? stockM.purity.name : '',
          purity_id: stockM.purity_id
        }
        materials.push(thisMObj);
      }
      thisObj.materials = materials;
      products.push(thisObj);
    }

  }

  res.send(formatResponse(products, 'Stock product details'));
}

/**
 * Check duplicate certidicate no
 * @param req
 * @param res
 */
exports.checkDuplicateCertificateNo = async (req, res) => {
  let data = req.body;
  if (isEmpty(data.certificate_no)) {
    return res.send(formatResponse({ is_exist: false }));
  }

  let stock = await stocksModel.findOne({ where: { certificate_no: data.certificate_no } });
  let is_exist = stock ? true : false;
  let purchaseProduct = await PurchaseProductModel.findOne({
    where: { certificate_no: data.certificate_no },
    include: [
      {
        model: PurchaseModel,
        as: 'purchase',
        required: true,
        where: { is_approved: { [Op.ne]: 2 } }
      }
    ]
  });
  is_exist = purchaseProduct ? true : is_exist;

  return res.send(formatResponse({ is_exist: is_exist }));

}

/**
 * Get category wise stock amount
 * @param req
 * @param res
 */
exports.getStockPriceByCategory = async (req, res) => {
  let { user_id, type, own_distributor, own_admin, own_se, total_avl_stock, manager } = req.query;
  type = isEmpty(type) ? 'product' : type;
  let userID = null;
  if (!isEmpty(user_id)) {
    userID = user_id;
  }
  userID = !userID ? (isManager(req) ? req.userId : await getWorkingUserID(req)) : userID;
  let userIdArr = [];

  let adminRoleId = getRoleId('admin');
  let distributorRoleId = getRoleId('distributor');
  let bySpecific = false;
  if (isSuperAdmin(req)) {
    if (own_distributor == "1" || own_distributor == "0") {
      let thisCon = { role_id: distributorRoleId };
      if (own_distributor == "1") {
        thisCon.own = true;
      } else if (own_distributor == "0") {
        thisCon.own = false;
      }
      let distributors = await UserModel.findAll({ attributes: ['id'], where: thisCon });
      userIdArr = arrayColumn(distributors, 'id');
      bySpecific = true;
    } else if (own_admin == "1" || own_admin == "0") {
      let thisCon = { role_id: adminRoleId };
      if (own_admin == "1") {
        thisCon.own = true;
      } else if (own_admin == "0") {
        thisCon.own = false;
      }
      let admins = await UserModel.findAll({ attributes: ['id'], where: thisCon });
      userIdArr = arrayColumn(admins, 'id');
      bySpecific = true;
    } else if (total_avl_stock == 1) {
      let ownUserIds = await avlStockUserIdsNew(req, );
      //ownUserIds.push(userID);
      userIdArr = ownUserIds;
      bySpecific = true;
    } else if (manager == 1) {
      let managerUsers = await UserModel.findAll({ attributes: ['id'], where: { role_id: getRoleId('manager') } });
      let managerUsersIds = arrayColumn(managerUsers, 'id');
      userIdArr = managerUsersIds
      bySpecific = true;
    }else if(own_se == 1){
      let se = await UserModel.findAll({ attributes: ['id'], where: { role_id: getRoleId('sales_executive') } });
      let seIds = arrayColumn(se, 'id');
      userIdArr = seIds
      bySpecific = true;
    }


  } else if (isAdmin(req)) {
    if (own_distributor == "1" || own_distributor == "0") {
      let state_id = await getUserColumnValue(req.userId, 'state_id');
      let thisCon = { role_id: distributorRoleId, state_id: state_id };
      if (own_distributor == "1") {
        thisCon.own = true;
      } else if (own_distributor == "0") {
        thisCon.own = false;
      }
      let distributors = await UserModel.findAll({ attributes: ['id'], where: thisCon });
      userIdArr = arrayColumn(distributors, 'id');
      bySpecific = true;
    }else if (total_avl_stock == 1) {
      let ownUserIds = await avlStockUserIdsNew(req, adminRoleId);
      ownUserIds.push(userID);
      userIdArr = ownUserIds;
      bySpecific = true;
    }
  }else if(isSalesExecutive(req)){
    if (total_avl_stock == 1) {
      let ownUserIds = await avlStockUserIdsNew(req);
      ownUserIds.push(userID);
      userIdArr = ownUserIds;
      bySpecific = true;
    }
  }else if(isDistributor(req)){
    if (total_avl_stock == 1) {
      let ownUserIds = await avlStockUserIdsNew(req);
      userIdArr = ownUserIds;
      bySpecific = true;
    }else if(own_se == 1){
      let seData = await UserModel.findAll({ attributes: ['id'], where: { role_id: getRoleId('sales_executive'), parent_id: req.userId } });
      let seIds = arrayColumn(seData, 'id');
      userIdArr = seIds
      bySpecific = true;
    }
  }
  if (!bySpecific) {
    userIdArr = [userID];
  }

  let result = await getTotalStockPriceByUser(true, userIdArr, type);

  return res.send(formatResponse(result));
}


/**
 * Move to stock
 *
 * @param {*} req
 * @param {*} res
 */
exports.moveToStock = async (req, res) => {
   
  let data = req.body;
  let stocks = await stocksModel.findAll({
    where: { id: { [Op.in]: data.stock_ids } },
    include: [
      {
        model: stock_materialsModel,
        as: 'stockMaterials',
        required: true,
        separate: true,
        include: [
          {
            model: materialModel,
            as: 'material'
          },
          {
            model: UnitModel,
            as: 'unit'
          }
        ]
      }
    ]
  });
  for (let i = 0; i < stocks.length; i++) {
    let thisItem = stocks[i];
    let product = await productsModel.findByPk(thisItem.product_id);
    if (product) {
      if (product.type != "material") {
        await stocksModel.update({ type: "product" }, { where: { id: thisItem.id } });
      } else {
        let quantity = 0, weight_in_gram = 0;
        for (let x = 0; x < thisItem.stockMaterials.length; x++) {
          quantity += thisItem.stockMaterials[x].quantity ? parseInt(thisItem.stockMaterials[x].quantity) : 0;
          weight_in_gram += thisItem.stockMaterials[x].weight_in_gram ? parseInt(thisItem.stockMaterials[x].weight_in_gram) : 0;
        }

        let result = await updateOrCreate(stocksModel,
          {
            user_id: req.userId,
            type: "product",
            product_id: thisItem.product_id
          }
          , {
            quantity: quantity,
            total_weight: weight_in_gram,
            user_id: req.userId,
            type: "product",
            product_id: thisItem.product_id
          }, null, ['quantity', 'total_weight']);
        let stock = result.item;

        let stockMaterial = await stock_materialsModel.findOne({ where: { stock_id: stock.id, material_id: thisItem.stockMaterials[x].material_id } });
        if (stockMaterial) {
          let thisquantity = thisItem.stockMaterials[x].quantity ? (parseInt(stockMaterial.quantity) + parseInt(thisItem.stockMaterials[x].quantity)) : stockMaterial.quantity;
          await stock_materialsModel.update({
            weight: weightFormat(parseFloat(stockMaterial.weight) + weightFormat(thisItem.stockMaterials[x].weight)),
            weight_in_gram: weightFormat(parseFloat(stockMaterial.weight_in_gram) + weightFormat(thisItem.stockMaterials[x].weight_in_gram)),
            quantity: thisquantity,
            purity_id: thisItem.stockMaterials[x].purity_id,
            unit_id: thisItem.stockMaterials[x].unit_id,
            category_id: category_id
          }, { where: { id: stockMaterial.id } });
        } else {
          await stock_materialsModel.create({
            stock_id: stock.id,
            material_id: thisItem.stockMaterials[x].material_id,
            weight: weightFormat(thisItem.stockMaterials[x].weight),
            weight_in_gram: weightFormat(thisItem.stockMaterials[x].weight_in_gram),
            quantity: thisItem.stockMaterials[x].quantity || 0,
            purity_id: thisItem.stockMaterials[x].purity_id,
            unit_id: thisItem.stockMaterials[x].unit_id,
            category_id: category_id
          });
        }
      }
    }
  }

  res.send(formatResponse("", "Moved to stock successfully."));
}

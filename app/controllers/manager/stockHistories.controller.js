const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const { getPaginationOptions } = require('@helpers/paginator');
const moment = require('moment');
const {isEmpty, isArray, priceFormat, formatDateTime} = require("@helpers/helper");
const { updateStockRawMaterialOutStanding } = require("@library/common");
const db = require("@models");
const { Op } = require("sequelize");
const sequelize = db.sequelize;
const {StockHistoriesCollection} = require("@resources/manager/StockHistoriesCollection");
const {WorkerStockCollection} = require("@resources/manager/WorkerStockCollection");
const {MaterialCollection} = require("@resources/superadmin/MaterialCollection");
const stockHistoryModel = db.stock_raw_material_histories;
const UserModel = db.users;
const UnitModel = db.units;
const MaterialModel = db.materials;
const CategoryModel = db.categories;
const PurityModel = db.purities;

/**
 * Retrieve all Stock histories
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit } = req.query;
  const paginatorOptions = getPaginationOptions(page, limit);
  stockHistoryModel.findAndCountAll({ 
    order:[['id', 'DESC']],
    offset: paginatorOptions.offset,
    limit: paginatorOptions.limit,
    group: ['batch_id'],
    include: [
      {
        model: stockHistoryModel,
        as: 'materials',
        include: [
          {
            model: MaterialModel,
            as: 'material'
          },
          {
            model: UnitModel,
            as: 'unit'
          }
        ]
      },
      {
        model: UserModel,
        as: 'fromUser'
      },
      {
        model: UserModel,
        as: 'toUser'
      }
    ]
  }).then(async (data) => {
    let result = {
      items: StockHistoriesCollection(data.rows),
      total: data.count.length,
    }
    res.send(formatResponse(result, 'Stock histories'));
  })
  .catch(err => {
    res.status(errorCodes.default).send(formatErrorResponse(err));
  });
};

/**
 * Create Stock histories
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
  let data = req.body;

  let batch_id = null;
  for(let i = 0; i < data.materials.length; i++){
    let stockH = await stockHistoryModel.create({
      belongs_to: data.user_id,
      from_user_id: req.userId,
      to_user_id: data.user_id,
      material_id: data.materials[i].material_id,
      weight: data.materials[i].weight,
      unit_id: data.materials[i].unit_id,
      quantity: !isEmpty(data.materials[i].quantity) ? data.materials[i].quantity : 0,
      date: moment(data.materials[i].date).format('YYYY-MM-DD'),
      type: 'credit',
      batch_id: batch_id
    });
    if(batch_id == null){
      batch_id = stockH.id;
      await stockHistoryModel.update({
        batch_id: batch_id
      },{where: {id: stockH.id}});
    }

    await updateStockRawMaterialOutStanding(stockH.id, {
      user_id: data.user_id,
      material_id: data.materials[i].material_id,
      weight: data.materials[i].weight,
      unit_id: data.materials[i].unit_id,
      quantity: !isEmpty(data.materials[i].quantity) ? data.materials[i].quantity : 0,
    }, "credit");
  }

  res.send(formatResponse([], "Stock History added successfully!"));
    
  
};


/**
 * View Stock histories
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.fetch = async (req, res) => {
  let stockHistories = await stockHistoryModel.findOne({
    where: { id: req.params.id},
    include: [
      {
        model: stockHistoryModel,
        as: 'materials',
        include: [
          {
            model: MaterialModel,
            as: 'material'
          },
          {
            model: UnitModel,
            as: 'unit'
          }
        ]
      },
      {
        model: UserModel,
        as: 'fromUser'
      },
      {
        model: UserModel,
        as: 'toUser'
      }
    ]
  });
  if (!stockHistories) {
    return res.status(errorCodes.default).send(formatErrorResponse('Stock histories not found'));
  }
  res.send(formatResponse(StockHistoriesCollection(stockHistories), "Stock histories fetched successfully!"));
};



/**
 * Update Product Category
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.update = async (req, res) => {
  let data = req.body;
  let stockHistory = await stockHistoryModel.findOne({ where: { id: req.params.id} });
  if (!stockHistory) {
    return res.status(errorCodes.default).send(formatErrorResponse('Stock history not found'));
  }

  let batch_id = stockHistory.batch_id;
  let ids = [];
  for(let i = 0; i < data.materials.length; i++){
    if(data.materials[i].id != 0){
      ids.push(data.materials[i].id);
    }
  }
  await stockHistoryModel.destroy({ where: { batch_id: batch_id, id: {[Op.notIn]: ids}}})

  for(let i = 0; i < data.materials.length; i++){
    let thisId = data.materials[i].id;
    if(data.materials[i].id == 0){
      let stockH = await stockHistoryModel.create({
        belongs_to: data.user_id,
        from_user_id: req.userId,
        to_user_id: data.user_id,
        material_id: data.materials[i].material_id,
        weight: !isEmpty(data.materials[i].weight) ? data.materials[i].weight : 1,
        unit_id: data.materials[i].unit_id,
        quantity: !isEmpty(data.materials[i].quantity) ? data.materials[i].quantity : 0,
        date: moment(data.materials[i].date).format('YYYY-MM-DD'),
        type: 'credit',
        batch_id: batch_id
      });
      thisId = stockH.id;
    }else{
      await stockHistoryModel.update({
        material_id: data.materials[i].material_id,
        weight: data.materials[i].weight,
        unit_id: data.materials[i].unit_id,
        quantity: data.materials[i].quantity,
      },{where: {id: data.materials[i].id}});
    }

    await updateStockRawMaterialOutStanding(thisId, {
      user_id: data.user_id,
      material_id: data.materials[i].material_id,
      weight: data.materials[i].weight,
      unit_id: data.materials[i].unit_id,
      quantity: !isEmpty(data.materials[i].quantity) ? data.materials[i].quantity : 0,
    }, "credit");
    
  }

  await stockHistoryModel.destroy({ where: { batch_id: batch_id, id: {[Op.notIn]: ids}}})

  res.send(formatResponse([], "Stock History updated successfully!"));



};

  
/**
 * delete Item
 * 
 * @param {*} req
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  let stockHistory = await stockHistoryModel.findOne({ where: { id: req.params.id} });
  if (!stockHistory) {
    return res.status(errorCodes.default).send(formatErrorResponse('Stock history not found'));
  }

  let stockstockHistorys = await stockHistoryModel.findAll({ where: { batch_id: stockHistory.batch_id} });
  stockHistoryModel.destroy({ where: { batch_id: stockHistory.batch_id} }).then(async(result) => {
    for(let i = 0; i < stockstockHistorys.length; i++){
      await updateStockRawMaterialOutStanding(stockstockHistorys[i].id, {
        user_id: stockstockHistorys[i].belongs_to,
        material_id: stockstockHistorys[i].material_id,
        weight: stockstockHistorys[i].weight,
        unit_id: stockstockHistorys[i].unit_id,
        quantity: stockstockHistorys[i].quantity
      }, "debit");
    }

    res.send(formatResponse("", 'Stock History deleted Successfully!'));
  }).catch(error => {
    return res.status(errorCodes.default).send(formatErrorResponse(error));
  });
};

/**
 * All materials
 * 
 * @param {*} req
 * @param {*} res 
 */
exports.materialList = async (req, res) => {
  let {category_id} = req.query;
  let conditions = !isEmpty(category_id) ? {id: category_id} : {};
  MaterialModel.findAll({
    order:[['name', 'ASC']],
    include: [
      {
        model: CategoryModel,
        as: 'category',
        required: true,
        where: conditions
      },
      {
        model: UnitModel,
        as: 'unit',
      },
      {
        model: PurityModel,
        as: 'purities',
      }
    ]
  }).then(async (data) => {
    res.send(formatResponse(await MaterialCollection(data), 'Materials'));
  })
  .catch(err => {
    res.status(errorCodes.default).send(formatErrorResponse(err));
  });

};

/**
 * Get Worker Stock
 * 
 * @param {*} req
 * @param {*} res 
 */
exports.workerStock = async (req, res) => {
  let { worker_id } = req.query;
  stockHistoryModel.findAndCountAll({ 
    order:[['id', 'DESC']],
    group: ['material_id'],
    where: {
      belongs_to: worker_id, 
      outstanding_gram: {
        [Op.gt]: 0
      }
    },
    include: [
      {
        model: MaterialModel,
        as: 'material'
      },
      {
        model: UnitModel,
        as: 'unit'
      }
    ]
  }).then(async (data) => {
    let result = {
      items: WorkerStockCollection(data.rows),
      total: data.count.length,
    }
    res.send(formatResponse(result, 'Stocks'));
  })
  .catch(err => {
    res.status(errorCodes.default).send(formatErrorResponse(err));
  });

}
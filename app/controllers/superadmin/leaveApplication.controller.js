const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { Op } = require("sequelize");
const { getPaginationOptions } = require('@helpers/paginator')
const {LeaveApplicationCollection} = require("@resources/superadmin/LeaveApplicationCollection")
const leaveApplicationModel = db.leave_applications;
const { isEmpty, arrayColumn } = require("@helpers/helper");
const { isSuperAdmin, isDistributor, getRoleId, sendNotification } = require("@library/common");
const usersModel = db.users;
const rolesModel= db.roles;

/**
 * Retrieve all Unit
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, all } = req.query;
  let conditions = {};
  if(!isSuperAdmin(req)){
    if(isDistributor(req)){
      let ids = await usersModel.findAll({where: {role_id: getRoleId('sales_executive'), parent_id: req.userId}, attributes: ['id'], raw : true});
      ids = arrayColumn(ids, 'id');
      conditions.user_id = {[Op.in]: ids}
    }else{
      conditions.user_id = req.userId;
    }
  }

  const paginatorOptions = getPaginationOptions(page, limit);
  leaveApplicationModel.findAndCountAll({ 
    order:[['id', 'DESC']],
    offset: paginatorOptions.offset,
    limit: paginatorOptions.limit,
    where: conditions,
    include: [
      {
        model: usersModel,
        as: 'user',
        include:[
          {
            model: rolesModel,
            as: 'role'
          }
        ]
      },
    ]
  }).then(async (data) => {
    let result = {
      items: LeaveApplicationCollection(data.rows),
      total: data.count,
    }
    res.send(formatResponse(result, 'leaveApplication'));
  })
  .catch(err => {
    res.status(errorCodes.default).send(formatErrorResponse(err));
  });
}

/**
 * Create Leave Application
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
  let data = req.body;

  const postData = {
    user_id: req.userId,
    status: 'pending',
    title: data.title,
    message: data.message,
    from_date: data.from_date,
    to_date: data.to_date,
  };

  leaveApplicationModel.create(postData).then(result => {

    sendNotification('leave_application', req, { leave: result, status: result.status });

    res.send(formatResponse("", "leave application created successfully!"));
  }).catch(error => {
    return res.status(errorCodes.default).send(formatErrorResponse('leave application does not created due to some error' + error));
  }); 
};


/**
 * View Leave Application
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.fetch = async (req, res) => {
  let conditions = {id: req.params.id};
  if(!isSuperAdmin(req)){
    if(isDistributor(req)){
      let ids = await usersModel.findAll({where: {role_id: getRoleId('sales_executive'), parent_id: req.userId}, attributes: ['id'], raw : true});
      ids = arrayColumn(ids, 'id');
      conditions.user_id = {[Op.in]: ids}
    }else{
      conditions.user_id = req.userId;
    }
  }

  let data = await leaveApplicationModel.findOne({ 
    where: conditions, 
    include: [
    {
      model: usersModel,
      as: 'user',
      include:[
        {
          model: rolesModel,
          as: 'role'
        }
      ]
    },
  ] });
  if (!data) {
    return res.status(errorCodes.default).send(formatErrorResponse('leave not found'));
  }
  res.send(formatResponse(LeaveApplicationCollection(data)));
};



/**
 * Update Unit
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.update = async (req, res) => {
  let data = req.body;
  let leaveAppltn = await leaveApplicationModel.findOne({ where: { id: req.params.id } });
  if (!leaveAppltn) {
    return res.status(errorCodes.default).send(formatErrorResponse('leave not found'));
  }
  if(!isSuperAdmin(req) && leaveAppltn.status != "pending"){
    return res.status(errorCodes.default).send(formatErrorResponse('You can\'t update this anymore.'));
  }

  let postData = {};
  if('title' in data){
    postData.title = data.title
  }
  if('message' in data){
    postData.message = data.message
  }
  if('status' in data){
    postData.status = data.status
  }
  if('explanation' in data){
    postData.explanation = data.explanation
  }
  if('from_date' in data){
    postData.from_date = data.from_date
  }
  if('to_date' in data){
    postData.to_date = data.to_date
  }
  leaveApplicationModel.update(postData, { where: { id: req.params.id } }).then(result => {
    if(postData.status && leaveAppltn.status != postData.status){
      sendNotification('leave_application', req, { leave: leaveAppltn, status: postData.status });
    }
    res.send(formatResponse("", "Updated successfully!"));
  }).catch(error => {
    return res.status(errorCodes.default).send(formatErrorResponse('laeve does not updated due to some error'));
  });
};



  
/**
 * decline leave
 * 
 * @param {*} req
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  leaveApplicationModel.destroy({ where: { id: req.params.id } }).then(result => {
    res.send(formatResponse("", 'leave Application deleted Successfully!'));
  }).catch(error => {
    return res.status(errorCodes.default).send(formatErrorResponse(error));
  });
};
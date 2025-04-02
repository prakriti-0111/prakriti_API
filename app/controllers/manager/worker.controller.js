const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const { getPaginationOptions } = require('@helpers/paginator');
const { isEmpty } = require("@helpers/helper");
const { base64FileUpload, removeFile } = require("@helpers/upload");
const db = require("@models");
const { Op } = require("sequelize");
const { getRoleId } = require("@library/common");
const {WorkerCollection} = require("@resources/manager/WorkerCollection");
const userModel = db.users;

var bcrypt = require("bcryptjs");

/**
 * Retrieve all worker
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
   let { page, limit } = req.query;
   const paginatorOptions = getPaginationOptions(page, limit);
   let workerRoleId = getRoleId('worker');

    userModel.findAndCountAll({ 
        where: { role_id: workerRoleId, parent_id: req.userId },
        order:[['id', 'ASC']],
        offset: paginatorOptions.offset,
        limit: paginatorOptions.limit,
      }).then(async (data) => {
        let result = {
          items: WorkerCollection(data.rows),
          total: data.count,
        }
        res.send(formatResponse(result, 'All Worker'));
      })
      .catch(err => { 
        res.status(errorCodes.default).send(formatErrorResponse(err));
      });
    };

/**
 * Create Worker
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
    let data = req.body;
    let workerRoleId = getRoleId('worker');

    const existing_mobile = await userModel.findOne({where: { mobile: data.mobile, role_id: workerRoleId } });
  
    if (existing_mobile) {
      return res.status(errorCodes.default).send(formatErrorResponse('User already exists'));
    }

    const postData1 = {
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      role_id: workerRoleId,
      created_by: req.userId,
      parent_id: req.userId

    };

    userModel.create(postData1).then(result => {
      if(!isEmpty(data.profile_image)){
        let profile_image_data = base64FileUpload(data.profile_image, 'users');
        userModel.update({profile_image: profile_image_data.path}, { where: { id: result.id} });
      }

      res.send(formatResponse(WorkerCollection(result), "Worker created successfully!"));
    }).catch(error => { 
      return res.status(errorCodes.default).send(formatErrorResponse('Worker does not created due to some error' + error));
    }); 
};


/**
 * Update Worker
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.update = async (req, res) => {
    let data = req.body;
    let workerRoleId = getRoleId('worker');
    let worker = await userModel.findOne({ where: { id: req.params.id } });
    if (!worker) {
      return res.status(errorCodes.default).send(formatErrorResponse('Worker not found'));
    }

    const existing_mobile = await userModel.findOne({where: { mobile: data.mobile, id: {[Op.ne]: req.params.id }, role_id: workerRoleId } });
  
    if (existing_mobile) {
      return res.status(errorCodes.default).send(formatErrorResponse('User already exists'));
    }

    const postData1 = {
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      role_id: workerRoleId,
      parent_id: req.userId
    };

    if(!isEmpty(data.password)){
      postData1.password = bcrypt.hashSync(data.password, 8);
    }

    userModel.update(postData1, { where: { id: req.params.id} }).then(result => {
      if(!isEmpty(data.profile_image)){
        removeFile(worker.profile_image);
        let profile_image_data = base64FileUpload(data.profile_image, 'users');
        userModel.update({profile_image: profile_image_data.path}, { where: { id: req.params.id} });
      }

      res.send(formatResponse(WorkerCollection(postData1), "Worker updated successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('Worker does not updated due to some error' + error));
    });
};


/**
 * View Worker
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.fetch = async (req, res) => {
  let workerRoleId = getRoleId('worker');
  let worker = await userModel.findOne({ where: { id: req.params.id, role_id: workerRoleId}, 
  });
  if (!worker) {
    return res.status(errorCodes.default).send(formatErrorResponse('Worker not found'));
  }
  res.send(formatResponse(WorkerCollection(worker), "Worker fetched successfully!"));
};

  
/**
 * delete Worker
 * 
 * @param {*} req
 * @param {*} res 
 */
 exports.delete = async (req, res) => {
    let worker = await userModel.findOne({ where: { id: req.params.id } });

    if(!isEmpty(worker.profile_image)){
      removeFile(worker.profile_image);
    }

    userModel.destroy({ where: { id: req.params.id} }).then(result => {
      res.send(formatResponse("", 'Worker deleted Successfully!'));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse(error));
    });
};
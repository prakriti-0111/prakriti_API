const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { getPaginationOptions } = require('@helpers/paginator')
const { isEmpty } = require("@helpers/helper");
const {LeaveCollection} = require("@resources/sales_executive/LeaveCollection");
const LeaveModel = db.leave_applications;
const UserModel = db.users;

/**
 * Retrieve all Leave
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, all } = req.query;
  if(all == 1){
    LeaveModel.findAll({ 
      order:[['id', 'ASC']],
      where: {user_id: req.userId},
      include: [
        
      ]
    }).then(async (data) => {
      let result = {
        items: LeaveCollection(data),
        total: data.length
      }
      res.send(formatResponse(result, 'Addresses'));
    })
    .catch(err => {
      res.status(errorCodes.default).send(formatErrorResponse(err));
    });
  }else{
    const paginatorOptions = getPaginationOptions(page, limit);
    LeaveModel.findAndCountAll({ 
        order:[['id', 'ASC']],
        offset: paginatorOptions.offset,
        limit: paginatorOptions.limit,
        where: {user_id: req.userId},
        include: [
          
        ]
      }).then(async (data) => {
        let result = {
          items: LeaveCollection(data.rows),
          total: data.count,
        }
        res.send(formatResponse(result, 'Addresses'));
      })
      .catch(err => {
        res.status(errorCodes.default).send(formatErrorResponse(err));
      });
    };
  }

/**
 * Create Leave
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
    let data = req.body;
  
    const postData = {
      user_id: req.userId,
      status: data.status,
      title: data.title,
      message: data.message,
    };
  
    LeaveModel.create(postData).then(result => {
      res.send(formatResponse([], "Leave Applied successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('Leave does not created due to some error' + error));
    }); 
};


/**
 * View Leave
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.fetch = async (req, res) => {
  let leaves = await LeaveModel.findOne({ where: { id: req.params.id, user_id: req.userId }, 
    include: [
      {
        model: UserModel,
        as: 'users',
      }
    ], 
  });
  if (!leaves) {
    return res.status(errorCodes.default).send(formatErrorResponse('Leave not found'));
  }
  res.send(formatResponse(LeaveCollection(address), "Leave fetched successfully!"));
};



/**
 * Update Leave
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.update = async (req, res) => {
    let data = req.body;
    let leave = await LeaveModel.findOne({ where: { id: req.params.id } });
    if (!leave) {
      return res.status(errorCodes.default).send(formatErrorResponse('Leave not found'));
    }
    const postData = {
      user_id: req.userId,
      status: data.status,
      title: data.title,
      message: data.message,
    };
    LeaveModel.update(postData, { where: { id: req.params.id } }).then(result => {
      res.send(formatResponse([], "Leave updated successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('Leave does not updated due to some error' + error));
    });
};



  
/**
 * delete Leave
 * 
 * @param {*} req
 * @param {*} res 
 */
exports.delete = async (req, res) => {
  let data = req.body;
    LeaveModel.destroy({ where: { id: data.id } }).then(result => {
      res.send(formatResponse("", 'Leave deleted Successfully!'));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse(error));
    });
};
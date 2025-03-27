const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { getPaginationOptions } = require('@helpers/paginator')
const {LeaveApplicationCollection} = require("@resources/distributor/LeaveApplicationCollection")
const leaveApplicationModel = db.leave_applications;
const { isEmpty } = require("@helpers/helper");
const usersModel = db.users;
const rolesModel= db.roles;
/**
 * Retrieve all Unit
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, all } = req.query;
  if(all == 1){
    leaveApplicationModel.findAll({ 
      order:[['id', 'ASC']]
    }).then(async (data) => {
      let result = {
        items: LeaveApplicationCollection(data),
        total: data.length
      }
      res.send(formatResponse(result, 'leaveApplication'));
    })
    .catch(err => {
      res.status(errorCodes.default).send(formatErrorResponse(err));
    });
  }else{
    const paginatorOptions = getPaginationOptions(page, limit);
    leaveApplicationModel.findAndCountAll({ 
          order:[['id', 'ASC']],
          offset: paginatorOptions.offset,
          limit: paginatorOptions.limit,
          include: [
            {
              model: usersModel,
              as: 'user',
              include:[
                {
                  model:rolesModel,
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
      };
    }

/**
 * Create Unit
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
    let data = req.body;
  
    const postData = {
      user_id: data.user_id,
    //   unit: data.unit,
    //   rate: data.rate,
      status: !isEmpty(data.status) ? data.status : 'pending',
      title:data.title
    };

    leaveApplicationModel.create(postData).then(result => {
      res.send(formatResponse(LeaveApplicationCollection(result), "leave application created successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('leave application does not created due to some error' + error));
    }); 
};


/**
 * View Unit
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.fetch = async (req, res) => {
  let unit = await leaveApplicationModel.findOne({
     where: { user_id: req.params.id },
    include: [
      {
        model: usersModel,
        as: 'user',
        include:[
          {
            model:rolesModel,
            as: 'role'
          }
        ]
      },
      ]});
  if (!unit) {
    return res.status(errorCodes.default).send(formatErrorResponse('leave not found'));
  }
  res.send(formatResponse(LeaveApplicationCollection(unit), "leave fetched successfully!"));
};



/**
 * Update Unit
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.update = async (req, res) => {
    let data = req.body;
    let unit = await leaveApplicationModel.findOne({ where: { id: req.params.id } });
    if (!unit) {
      return res.status(errorCodes.default).send(formatErrorResponse('Unit not found'));
    }
    const postData = {
      name: data.name,
      unit: data.unit,
      rate: data.rate,
      message:data.message
    };
    leaveApplicationModel.update(postData, { where: { id: req.params.id } }).then(result => {
      res.send(formatResponse(LeaveApplicationCollection(data), "Unit updated successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('Unit does not updated due to some error' + error));
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
      res.send(formatResponse("", 'leave Application decline Successfully!'));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse(error));
    });
};
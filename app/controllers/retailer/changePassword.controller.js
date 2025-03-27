const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const { getPaginationOptions } = require('@helpers/paginator');
const { isEmpty } = require("@helpers/helper");
const db = require("@models");
const { Op } = require("sequelize");
const { getRoleId } = require("@library/common");
const userModel = db.users;

var bcrypt = require("bcryptjs");


/**
 * Change Password
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.changePassword = async (req, res) => {
    let data = req.body;
    let customer = await userModel.findOne({ where: { id: req.userId } });
    if (!customer) {
      return res.status(errorCodes.default).send(formatErrorResponse('Customer not found'));
    }

    var passwordIsValid = bcrypt.compareSync(
      data.old_password,
      customer.password
    );
  
    if (! passwordIsValid) {
      return res.status(errorCodes.default).send(formatErrorResponse("Current password does not matched."));
    }

    if(data.new_password != data.confirm_password){
      return res.status(errorCodes.default).send(formatErrorResponse(config.validationMessages.confirmPwdNotMatch));
    }

    const postData = {
      password:  bcrypt.hashSync(data.new_password, 8),
    };  

    userModel.update(postData, { where: { id: req.userId} }).then(result => {
      res.send(formatResponse([], "Password updated successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('Password does not updated due to some error' + error));
    });
};


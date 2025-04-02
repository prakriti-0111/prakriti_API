const config = require("@config/auth.config");
const db = require("@models");
const { Op } = require("sequelize");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const { getRoleId, updateCartByCookieID, sendEmail } = require("@library/common");
const { isEmpty } = require("@helpers/helper");
const { addActivityLog } = require("@library/activityLog");
const {UserCollection} = require("@resources/customer/UserCollection");
const UserModel = db.users;
const RoleModel = db.roles;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

/**
 * sign in user
 *
 * @param req
 * @param res
 */
exports.signin = async (req, res) => {
  let customerRoleId = getRoleId('customer');
  let sales_executiveRoleId = getRoleId('sales_executive');
  let retailerRoleId = getRoleId('retailer');
  const user = await UserModel.findOne({
    where: { mobile: req.body.mobile,
      role_id: {[Op.in]: [customerRoleId, sales_executiveRoleId, retailerRoleId]}
    },
    include: [
      {
        model: RoleModel,
        as: 'role'
      }
    ]
  });

  if (! user) {
    return res.status(errorCodes.default).send(formatErrorResponse(config.validationMessages.usernameNotFound));
  }
  var passwordIsValid = bcrypt.compareSync(
    req.body.password,
    user.password
  );

  if (! passwordIsValid) {
    return res.status(errorCodes.default).send(formatErrorResponse(config.validationMessages.passwordError));
  }

  var token = jwt.sign({ id: user.id, role: user.role_id}, config.secret, {
    expiresIn: 86400 * config.login_expire_days
  });

  //update cart from cookie id
  await updateCartByCookieID(req.body.cookie_id, user.id);

  //add log
  await addActivityLog({
    ...req.body,
    role: user.role_id,
    user: user.id
  }, 'login')

  res.send(formatResponse({
    user: UserCollection(user),
    access_token: token
  }, "Login successfully!"));


};

/**
 * Logout
 * 
 * @param req
 * @param res
 */
exports.logout = async(req, res) => {
   //add log
   await addActivityLog({
    ...req.body,
    role: req.role,
    user: req.userId
  }, 'logout')

  res.send(formatResponse("", "Logout successfully!"));
};

/**
 * Forgot Password send otp
 * 
 * @param req
 * @param res
 */
 exports.forgotPasswordSendOtp = async(req, res) => {
  let customerRoleId = getRoleId('customer');
  let sales_executiveRoleId = getRoleId('sales_executive');
  let retailerRoleId = getRoleId('retailer');
  const user = await UserModel.findOne({
    where: { 
      mobile: req.body.user_name,
      role_id: {[Op.in]: [customerRoleId, sales_executiveRoleId, retailerRoleId]}
    }
  });

  if (! user) {
    return res.status(errorCodes.default).send(formatErrorResponse("User not found."));
  }
  if(isEmpty(user.email)){
    return res.status(errorCodes.default).send(formatErrorResponse("Email not found."));
  }

  let otp = Math.floor(1000 + Math.random() * 9000);
  let message = 'Your reset password otp is: ' + otp;
  let result = await sendEmail({to: user.email, subject: 'Reset Password OTP', message: message});
  if(!result){
    return res.status(errorCodes.default).send(formatErrorResponse(errorCodes.defaultErrorMsg));
  }

  await UserModel.update({reset_otp: otp}, { where: { id: user.id } })

  res.send(formatResponse("", "Otp sent successfully!"));

}

/**
 * Forgot Password verify otp
 * 
 * @param req
 * @param res
 */
exports.forgotPasswordVerifyOtp = async(req, res) => {
  let customerRoleId = getRoleId('customer');
  let sales_executiveRoleId = getRoleId('sales_executive');
  let retailerRoleId = getRoleId('retailer');
  const user = await UserModel.findOne({
    where: { 
      mobile: req.body.user_name,
      role_id: {[Op.in]: [customerRoleId, sales_executiveRoleId, retailerRoleId]},
      reset_otp: req.body.otp || ''
    }
  });

  if (! user) {
    return res.status(errorCodes.default).send(formatErrorResponse("OTP is invalid."));
  }

  res.send(formatResponse("", "OTP is verified successfully!"));

}

/**
 * Forgot Password update password
 * 
 * @param req
 * @param res
 */
exports.forgotPassword = async(req, res) => {
  let customerRoleId = getRoleId('customer');
  let sales_executiveRoleId = getRoleId('sales_executive');
  let retailerRoleId = getRoleId('retailer');
  const user = await UserModel.findOne({
    where: { 
      mobile: req.body.user_name,
      role_id: {[Op.in]: [customerRoleId, sales_executiveRoleId, retailerRoleId]},
      reset_otp: req.body.otp || ''
    }
  });

  if (! user) {
    return res.status(errorCodes.default).send(formatErrorResponse("User not found."));
  }

  if(req.body.new_password != req.body.confirm_new_password){
    return res.status(errorCodes.default).send(formatErrorResponse("Password and confirm password doesn't match"));
  }

  let data = {
    password: bcrypt.hashSync(req.body.new_password, 8)
  }

  UserModel.update(data, { where: { id: user.id } }).then(result => {
    res.send(formatResponse("", 'Password changed successfully!'));
  }).catch(error => {
    return res.status(errorCodes.default).send(formatErrorResponse(errorCodes.defaultErrorMsg));
  });
}


/**
 * Social Login
 * 
 * @param req
 * @param res
 */
exports.socialLogin = async(req, res) => {

}

/**
 * check existing user
 *
 * @param req
 * @param res
 */
exports.existingUser = async (req, res) => {
  let customerRoleId = getRoleId('customer');
  let sales_executiveRoleId = getRoleId('sales_executive');
  let retailerRoleId = getRoleId('retailer');
  const user = await UserModel.findOne({
    where: { 
      mobile: req.body.mobile,
      role_id: {[Op.in]: [customerRoleId, sales_executiveRoleId, retailerRoleId]}
    }
  });

  if (! user) {
    return res.send(formatErrorResponse(config.validationMessages.usernameNotFound));
  }
  
  res.send(formatResponse(''));
}
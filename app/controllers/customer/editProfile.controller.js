const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const { getPaginationOptions } = require('@helpers/paginator');
const { isEmpty, getFileAbsulatePath, defaultProfileImage } = require("@helpers/helper");
const { base64FileUpload, removeFile } = require("@helpers/upload");
const db = require("@models");
const { Op } = require("sequelize");
const { getRoleId } = require("@library/common");
const userModel = db.users;

/**
 * Edit Profile Customer
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.editProfile = async (req, res) => {
    let data = req.body;
    let customerRoleId = req.role;
    let customer = await userModel.findOne({ where: { id: req.userId } });
    if (!customer) {
      return res.status(errorCodes.default).send(formatErrorResponse('Customer not found'));
    }
    
    if('mobile' in data){
      const existing_mobile = await userModel.findOne({where: { mobile: data.mobile, id: {[Op.ne]: req.userId }, role_id: customerRoleId } });

      //const existing_email = await userModel.findOne({where: { email: data.email, id: {[Op.ne]: req.userId } } });
    
      if (existing_mobile) {
        return res.status(errorCodes.default).send(formatErrorResponse('User already exists'));
      }
    }

    //upload profile image
    let profile_image = customer.profile_image;
    if('profile_image' in data && !isEmpty(data.profile_image)){
      //remove old
      removeFile(customer.profile_image);

      //upload new
      let result = base64FileUpload(data.profile_image, 'users');
      if(result){
        profile_image = result.path;
      }
    }

    let postData = {profile_image: profile_image};
    if('name' in data){
      postData.name = data.name;
    }
    if('email' in data){
      postData.email = data.email || null;
    }
    if('mobile' in data){
      postData.mobile = data.mobile;
    }
    if('dob' in data){
      postData.dob = data.dob;
    }
    if('marital_status' in data){
      postData.marital_status = data.marital_status;
    }

    userModel.update(postData, { where: { id: req.userId} }).then(result => {
      res.send(formatResponse({
        image_url: (!isEmpty(profile_image)) ? getFileAbsulatePath(profile_image) : defaultProfileImage(),
      }, "Updated successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('Customer does not updated due to some error' + error));
    });
};


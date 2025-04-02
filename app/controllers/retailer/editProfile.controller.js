const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const { getPaginationOptions } = require('@helpers/paginator');
const { isEmpty, getFileAbsulatePath, defaultProfileImage } = require("@helpers/helper");
const { base64FileUpload, removeFile } = require("@helpers/upload");
const db = require("@models");
const { Op } = require("sequelize");
const { getRoleId } = require("@library/common");
const {UserCollection} = require("@resources/retailer/UserCollection");
const userModel = db.users;

/**
 * Edit Profile Customer
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.editProfile = async (req, res) => {
    let data = req.body;
    let customerRoleId = getRoleId('retailer');
    let customer = await userModel.findOne({ where: { id: req.userId } });
    if (!customer) {
      return res.status(errorCodes.default).send(formatErrorResponse('Customer not found'));
    }

    const existing_mobile = await userModel.findOne({where: { mobile: data.mobile, id: {[Op.ne]: req.userId }, role_id: customerRoleId } });

    //const existing_email = await userModel.findOne({where: { email: data.email, id: {[Op.ne]: req.userId } } });
  
    if (existing_mobile) {
      return res.status(errorCodes.default).send(formatErrorResponse('User already exists'));
    }

    //upload profile image
    let profile_image = customer.profile_image;
    if(!isEmpty(data.profile_image)){
      //remove old
      removeFile(customer.profile_image);

      //upload new
      let result = base64FileUpload(data.profile_image, 'users');
      if(result){
        profile_image = result.path;
      }
    }

    const postData = {
      name: data.name,
      email: data.email || null,
      mobile: data.mobile,
      role_id: customerRoleId,
      profile_image: profile_image
    };

    userModel.update(postData, { where: { id: req.userId} }).then(result => {
      res.send(formatResponse({
        image_url: (!isEmpty(profile_image)) ? getFileAbsulatePath(profile_image) : defaultProfileImage(),
      }, "Updated successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('Customer does not updated due to some error' + error));
    });
};


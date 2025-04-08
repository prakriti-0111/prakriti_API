const {
  errorCodes,
  formatErrorResponse,
  formatResponse,
} = require("@utils/response.config");
const db = require("@models");
const { Op } = require("sequelize");
const { base64FileUpload } = require("@helpers/upload");
const {
  getRoleId,
  getUserColumnValue,
  getNextUserName,
} = require("@library/common");
const {
  RetailerCollection,
} = require("@resources/superadmin/RetailerCollection");
const userModel = db.users;
const UserToUserModel = db.user_to_users;

var bcrypt = require("bcryptjs");

/**
 * Retrieve all admin
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let roleId = getRoleId("retailer");
  let conditions = await getCommonCondition(req);

  userModel
    .findAll({
      where: { role_id: roleId, ...conditions },
      order: [["name", "ASC"]],
    })
    .then(async (data) => {
      let result = {
        items: await RetailerCollection(data),
        total: data.length,
      };

      res.send(formatResponse(result, "customer-----------------All Retailer"));
    })
    .catch((err) => {
      res
        .status(errorCodes.default)
        .send(formatErrorResponse(errorCodes.defaultErrorMsg));
    });
};

/**
 * Create Retailer
 *
 * @param {*} req
 * @param {*} res
 */
exports.store = async (req, res) => {
  let data = req.body;
  let roleId = getRoleId("retailer");

  /**
   * check if mobile is exist or not
   */
  const existing_mobile = await userModel.findOne({
    where: { mobile: data.mobile /*, role_id: roleId*/ },
  });
  if (existing_mobile) {
    return res
      .status(errorCodes.default)
      .send(formatErrorResponse("This mobile is already exists."));
  }

  //upload profile image
  let profile_image = null;
  let result = await base64FileUpload(data.profile_image, "users");
  if (result) {
    profile_image = result.path;
  }

  //upload pan image
  let pan_image = null;
  result = await base64FileUpload(data.pan_image, "users");
  if (result) {
    pan_image = result.path;
  }

  //upload adhar image
  let adhar_image = null;
  result = await base64FileUpload(data.adhar_image, "users");
  if (result) {
    adhar_image = result.path;
  }

  //upload company logo
  let company_logo = null;
  result = await base64FileUpload(data.company_logo, "users");
  if (result) {
    company_logo = result.path;
  }

  //upload documents
  let documents = [];
  for (let i = 0; i < data.documents.length; i++) {
    let result = await base64FileUpload(data.documents[i], "users");
    if (result) {
      documents.push(result);
    }
  }
  let user_name = await getNextUserName("retailer");

  const postData = {
    role_id: roleId,
    //parent_id: isSalesExecutive(req) ? req.userId : null,
    user_name: user_name,
    name: data.name,
    email: data.email,
    mobile: data.mobile,
    adhar: data.adhar || null,
    pan: data.pan || null,
    password: bcrypt.hashSync(data.password, 8),
    address: data.address || null,
    city: data.city || null,
    landmark: data.landmark || null,
    pincode: data.pincode || null,
    district_id: data.district_id || null,
    state_id: data.state_id || null,
    country_id: data.country_id || null,
    p_address: data.p_address || null,
    p_city: data.p_city || null,
    p_pincode: data.p_pincode || null,
    p_district_id: data.p_district_id || null,
    p_state_id: data.p_state_id || null,
    p_country_id: data.p_country_id || null,
    company_name: data.company_name || null,
    gst: data.gst || null,
    bank_name: data.bank_name || null,
    bank_account_no: data.bank_account_no || null,
    bank_ifsc: data.bank_ifsc || null,
    profile_image: profile_image,
    pan_image: pan_image,
    adhar_image: adhar_image,
    company_logo: company_logo,
    status: data.status ? true : false,
    created_by: req.userId,
    documents: documents,
  };

  userModel
    .create(postData)
    .then(async (result) => {
      await UserToUserModel.create({
        user_id: req.userId,
        to_user_id: result.id,
        to_role_id: roleId,
      });

      res.send(formatResponse("", "Retailer created successfully!"));
    })
    .catch((error) => {
      return res
        .status(errorCodes.default)
        .send(formatErrorResponse(errorCodes.defaultErrorMsg));
    });
};

const getCommonCondition = async (req) => {
  let state_id = await getUserColumnValue(req.userId, "state_id");
  return { state_id: state_id };
};

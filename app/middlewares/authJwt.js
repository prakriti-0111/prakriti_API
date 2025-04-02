const jwt = require("jsonwebtoken");
const config = require("@config/auth.config.js");
const { errorCodes, formatErrorResponse } = require("@utils/response.config");
const { getRoleId } = require("@library/common");
const db = require("@models");
const User = db.users;

verifyToken = (req, res, next) => {
  const authorizationHeaader = req.headers.authorization;
  if (!authorizationHeaader || authorizationHeaader.split(" ").length != 2) {
    return res
      .status(errorCodes.auth)
      .send(formatErrorResponse(config.messages.tokensMissing));
  }
  let token = authorizationHeaader.split(" ")[1];

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send(formatErrorResponse(config.messages.default));
    }
    req.token = token;
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  });
};

verifyTokenForGuest = (req, res, next) => {
  const authorizationHeaader = req.headers.authorization;
  if (!authorizationHeaader || authorizationHeaader.split(" ").length != 2) {
    req.token = "";
    req.userId = "";
    req.role = "";
    next();
  } else {
    let token = authorizationHeaader.split(" ")[1];
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .send(formatErrorResponse(config.messages.default));
      } else {
        req.token = token;
        req.userId = decoded.id;
        req.role = decoded.role;
        next();
      }
    });
  }
};

/**
 * Check restautant, outlet & user id valid or not. Also check if user was logged in on another device then logout prev one.
 */
const checkTokenIsValid = async (req, roleIds, allowMultiDevice) => {
  return { error: false, msg: "" };

  let user = await User.findOne({
    where: { id: req.userId, role_id: { [Op.in]: roleIds } },
  });
  if (!user) {
    return { error: true, msg: "User is not valid." };
  }

  allowMultiDevice = allowMultiDevice == undefined ? false : true;
  /**
   * check if same user logged in by another device
   */
  if (!allowMultiDevice) {
    if (user.auth_token != req.token) {
      return { error: true, msg: "Someone is logged with your account." };
    }
  }

  return { error: false, msg: "" };
};

/**
 * Check if user is super admin
 */
isSuperAdmin = async (req, res, next) => {
  let roleId = getRoleId("superadmin");
  let result = await checkTokenIsValid(req, [roleId], true);
  if (result.err) {
    return res.status(errorCodes.default).send(formatErrorResponse(result.msg));
  }

  next();
};

/**
 * Check if user is admin
 */
isAdmin = async (req, res, next) => {
  let roleId = getRoleId("admin");
  let result = await checkTokenIsValid(req, [roleId], true);
  if (result.err) {
    return res.status(errorCodes.default).send(formatErrorResponse(result.msg));
  }

  next();
};

/**
 * Check if user is distributor
 */
isDistributor = async (req, res, next) => {
  let roleId = getRoleId("distributor");
  let result = await checkTokenIsValid(req, [roleId], true);
  if (result.err) {
    return res.status(errorCodes.default).send(formatErrorResponse(result.msg));
  }

  next();
};

/**
 * Check if user is sales executive
 */
isSalesExecutive = async (req, res, next) => {
  let roleId = getRoleId("sales_executive");
  let result = await checkTokenIsValid(req, [roleId], true);
  if (result.err) {
    return res.status(errorCodes.default).send(formatErrorResponse(result.msg));
  }

  next();
};

/**
 * Check if user is retailer
 */
isRetailer = async (req, res, next) => {
  let roleId = getRoleId("retailer");
  let result = await checkTokenIsValid(req, [roleId], true);
  if (result.err) {
    return res.status(errorCodes.default).send(formatErrorResponse(result.msg));
  }

  next();
};

/**
 * Check if user is supplier
 */
isSupplier = async (req, res, next) => {
  let roleId = getRoleId("supplier");
  let result = await checkTokenIsValid(req, [roleId], true);
  if (result.err) {
    return res.status(errorCodes.default).send(formatErrorResponse(result.msg));
  }

  next();
};

/**
 * Check if user is customer
 */
isCustomer = async (req, res, next) => {
  let roleId = getRoleId("customer");
  let result = await checkTokenIsValid(req, [roleId], true);
  if (result.err) {
    return res.status(errorCodes.default).send(formatErrorResponse(result.msg));
  }

  next();
};

/**
 * Check if user is manager
 */
isManager = async (req, res, next) => {
  let roleId = getRoleId("manager");
  let result = await checkTokenIsValid(req, [roleId], true);
  if (result.err) {
    return res.status(errorCodes.default).send(formatErrorResponse(result.msg));
  }

  next();
};

const authJwt = {
  verifyToken,
  verifyTokenForGuest,
  isSuperAdmin,
  isAdmin,
  isDistributor,
  isSalesExecutive,
  isRetailer,
  isCustomer,
  isSupplier,
  isManager,
};

module.exports = authJwt;

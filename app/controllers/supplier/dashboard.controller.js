const config = require("@config/auth.config");
const { formatResponse } = require("@utils/response.config");

/**
 * Retailer Dashboard
 *
 * @param req
 * @param res
 */
exports.index = async (req, res) => {


    res.send(formatResponse("", "Dashboard"));
}
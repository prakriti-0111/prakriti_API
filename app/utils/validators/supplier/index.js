const db = require("@models");
const {  signIn } = require("./auth");

/**
 * Finally export all validations
 */
module.exports = {
    signIn
}
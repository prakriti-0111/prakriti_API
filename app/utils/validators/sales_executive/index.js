const db = require("@models");
const {  signIn } = require("./auth");
const {  editProfile } = require("./edit_profile");
const {  changePassword } = require("./change_password");

/**
 * Finally export all validations
 */
module.exports = {
    signIn,
    editProfile,
    changePassword
}
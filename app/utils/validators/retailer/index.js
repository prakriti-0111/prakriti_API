const db = require("@models");
const {  signIn } = require("./auth");
const {  signup } = require("./signup");
const {  editProfile } = require("./edit_profile");
const {  changePassword } = require("./change_password");
const {  AddressCreate, AddressUpdate } = require("./address");

/**
 * Finally export all validations
 */
module.exports = {
    signIn,
    signup,
    editProfile,
    changePassword,
    AddressCreate,
    AddressUpdate
}
const db = require("@models");
const {  signIn } = require("./auth");
const {  signup } = require("./signup");
const {  editProfile } = require("./edit_profile");
const {  changePassword } = require("./change_password");
const {  AddressCreate, AddressUpdate } = require("./address");
const {  CartCreate, CartUpdate } = require("./cart");
const {  OrderPlace, OrderCancel } = require("./order");
const { updateWishlist } = require("./wishlist");
const { priceInfo } = require("./price_info");


/**
 * Finally export all validations
 */
module.exports = {
    signIn,
    signup,
    editProfile,
    changePassword,
    AddressCreate,
    AddressUpdate,
    CartCreate,
    CartUpdate,
    OrderPlace,
    OrderCancel,
    updateWishlist,
    priceInfo
}
const db = require("@models");
const {  signIn } = require("./auth");
const {  CartCreate, CartUpdate } = require("./cart");
const {  OrderPlace, OrderCancel } = require("./order");
const { updateWishlist } = require("./wishlist");

/**
 * Finally export all validations
 */
module.exports = {
    signIn,
    CartCreate,
    CartUpdate,
    OrderPlace,
    OrderCancel,
    updateWishlist,
}
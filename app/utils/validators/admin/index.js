const db = require("@models");
const {  signIn } = require("./auth");
const {  DistributorCreate,   DistributorUpdate } = require("./distributor");
const {  SupplierCreate, SupplierUpdate } = require("./supplier");

/**
 * Finally export all validations
 */
module.exports = {
    signIn,
    DistributorCreate,
    DistributorUpdate,
    SupplierCreate,
    SupplierUpdate,
}
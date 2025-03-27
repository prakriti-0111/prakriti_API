const db = require("@models");
const {  signIn } = require("./auth");
const {  WorkerCreate, WorkerUpdate } = require("./worker");


/**
 * Finally export all validations
 */
module.exports = {
    signIn,
    WorkerCreate,
    WorkerUpdate,
}
"use strict";

const fs   = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env    = process.env.NODE_ENV || "development";
const allConfig = require(__dirname + "/../config/config.js");
const config = allConfig[env] || allConfig.development;
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Test DB connection and print details
sequelize.authenticate()
  .then(() => {
    console.log("┌─────────────────────────────────────────┐");
    console.log("│         DATABASE CONNECTION              │");
    console.log("├─────────────────────────────────────────┤");
    console.log(`│  Status   : ✅ Connected                 │`);
    console.log(`│  ENV      : ${env.padEnd(29)}│`);
    console.log(`│  Host     : ${config.host.padEnd(29)}│`);
    console.log(`│  Port     : ${String(config.port).padEnd(29)}│`);
    console.log(`│  Database : ${config.database.padEnd(29)}│`);
    console.log(`│  Username : ${config.username.padEnd(29)}│`);
    console.log("└─────────────────────────────────────────┘");
  })
  .catch((err) => {
    console.log("┌─────────────────────────────────────────┐");
    console.log("│         DATABASE CONNECTION              │");
    console.log("├─────────────────────────────────────────┤");
    console.log(`│  Status   : ❌ FAILED                    │`);
    console.log(`│  ENV      : ${env.padEnd(29)}│`);
    console.log(`│  Host     : ${config.host.padEnd(29)}│`);
    console.log(`│  Port     : ${String(config.port).padEnd(29)}│`);
    console.log(`│  Database : ${config.database.padEnd(29)}│`);
    console.log("├─────────────────────────────────────────┤");
    console.log(`│  Error: ${err.message.substring(0, 33).padEnd(33)}│`);
    console.log("└─────────────────────────────────────────┘");
  });

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;

require('dotenv').config();

module.exports = {
  development: {
    // username: process.env.DB_USERNAME || "root",
    // password: process.env.DB_PASSWORD || "root",
    // database: process.env.DB_DATABASE || "prakriti",
    // host: process.env.DB_HOST || "127.0.0.1",
    // dialect: "mysql",
    username: process.env.DB_USERNAME || "mysql",
    password: process.env.DB_PASSWORD || "prakriti-dev",
    database: process.env.DB_DATABASE || "prakriti-dev",
    host: process.env.DB_HOST || "194.238.18.233",
    port: process.env.DB_PORT || 3307,
    dialect: "mysql",
    timezone: "+05:30",
    port: process.env.DB_PORT || 3306,
    logging: false,
    pool: {
      max: 20,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  },
  production: {
    username: process.env.DB_USERNAME || "mysql",
    password: process.env.DB_PASSWORD || "prakriti",
    database: process.env.DB_DATABASE || "prakriti",
    host: process.env.DB_HOST || "194.238.18.233",
    port: process.env.DB_PORT || 3307,
    dialect: "mysql",
    timezone: "+05:30",
    logging: false,
    pool: {
      max: 20,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  },
};


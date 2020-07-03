'use strict';
const mysql = require('mysql');

const db = mysql.createConnection({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "1234567",
//   database: process.env.DB_NAME || "nodejs_api"
  host: process.env.DB_HOST || "den1.mysql5.gear.host",
  user: process.env.DB_USER || "quanlynhatro01",
  password: process.env.DB_PASSWORD || "Kj6k!BngQ_e3",
  database: process.env.DB_NAME || "quanlynhatro01"
});

module.exports = db
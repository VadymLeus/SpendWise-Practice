const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'SpendWiseDB',
};

const db = mysql.createPool(dbConfig);

module.exports = db;

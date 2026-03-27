const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../bd/dashboard.db');

const db = new Database(dbPath); 

module.exports = db;
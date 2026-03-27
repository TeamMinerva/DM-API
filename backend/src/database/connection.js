const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// caminho absoluto até o banco
const dbPath = path.resolve(__dirname, "../../../bd/dados.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Erro ao conectar no banco:", err.message);
  } else {
    console.log("📦 Conectado ao SQLite em:", dbPath);
  }
});

module.exports = db;
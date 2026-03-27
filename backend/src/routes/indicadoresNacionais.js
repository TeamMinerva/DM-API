const express = require("express");
const router = express.Router();
const db = require("../database/connection");

// indicador nacional
router.get("/inadimplencia", (req, res) => {
  const query = `
    SELECT 
      SUM(carteira_inadimplencia) as inadimplencia,
      SUM(carteira_ativa) as total
    FROM dados_bcb
  `;

  db.get(query, [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const taxa = (row.inadimplencia / row.total) * 100;

    res.json({
      taxa_inadimplencia: Number(taxa.toFixed(2))
    });
  });
});

router.get("/operacoes", (req, res) => {
  const query = `
    SELECT SUM(numero_de_operacoes) as total_operacoes
    FROM dados_bcb
  `;

  db.get(query, [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      total_operacoes: row.total_operacoes
    });
  });
});

router.get("/carteira", (req, res) => {
  const query = `
    SELECT SUM(carteira_ativa) as carteira_total
    FROM dados_bcb
  `;

  db.get(query, [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      carteira_total: row.carteira_total
    });
  });
});

router.get("/crescimento", (req, res) => {
  const query = `
    SELECT 
      data_base,
      SUM(carteira_ativa) as total
    FROM dados_bcb
    GROUP BY data_base
    ORDER BY data_base
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (rows.length < 2) {
      return res.json({ crescimento: null });
    }

    const primeiro = rows[0].total;
    const ultimo = rows[rows.length - 1].total;

    const crescimento = ((ultimo - primeiro) / primeiro) * 100;

    res.json({
      crescimento_carteira: Number(crescimento.toFixed(2))
    });
  });
});

module.exports = router;
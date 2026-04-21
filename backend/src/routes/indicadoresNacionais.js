const express = require("express");
const router = express.Router();
const db = require("../database/connection");

// Indicador nacional: Inadimplência
router.get("/inadimplencia", async (req, res) => {
  const query = `
    SELECT 
      SUM(carteira_inadimplencia) as inadimplencia,
      SUM(carteira_ativa) as total
    FROM dados_bcb
  `;

  try {
    const resultado = await db.query(query);
    const row = resultado.rows[0];

    const inad = parseFloat(row.inadimplencia) || 0;
    const total = parseFloat(row.total) || 0;
    const taxa = total > 0 ? (inad / total) * 100 : 0;

    res.json({
      taxa_inadimplencia: Number(taxa.toFixed(2))
    });
  } catch (err) {
    console.error("Erro na inadimplência:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Total de Operações
router.get("/operacoes", async (req, res) => {
  const query = `
    SELECT SUM(numero_de_operacoes) as total_operacoes
    FROM dados_bcb
  `;

  try {
    const resultado = await db.query(query);
    const row = resultado.rows[0];

    res.json({
      total_operacoes: parseInt(row.total_operacoes) || 0
    });
  } catch (err) {
    console.error("Erro em operações:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Carteira Total
router.get("/carteira", async (req, res) => {
  const query = `
    SELECT SUM(carteira_ativa) as carteira_total
    FROM dados_bcb
  `;

  try {
    const resultado = await db.query(query);
    const row = resultado.rows[0];

    res.json({
      carteira_total: parseFloat(row.carteira_total) || 0
    });
  } catch (err) {
    console.error("Erro em carteira:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Crescimento Nacional
router.get("/crescimento", async (req, res) => {
  const query = `
    SELECT 
      data_base,
      SUM(carteira_ativa) as total
    FROM dados_bcb
    GROUP BY data_base
    ORDER BY data_base ASC
  `;

  try {
    const resultado = await db.query(query);
    const rows = resultado.rows;

    // Mantendo a lógica de retornar crescimento_carteira: null se houver menos de 2 meses
    if (rows.length < 2) {
      return res.json({ crescimento_carteira: null });
    }

    const primeiro = parseFloat(rows[0].total) || 0;
    const ultimo = parseFloat(rows[rows.length - 1].total) || 0;

    let crescimento = 0;
    if (primeiro > 0) {
      crescimento = ((ultimo - primeiro) / primeiro) * 100;
    }

    res.json({
      crescimento_carteira: Number(crescimento.toFixed(2))
    });
  } catch (err) {
    console.error("Erro em crescimento:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
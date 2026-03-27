const express = require("express");
const router = express.Router();
const db = require("../database/connection");

function executarKpi(res, uf, tipo_cliente) {
  let baseQuery = `
    SELECT 
      COALESCE(SUM(numero_de_operacoes), 0) AS total_operacoes,
      COALESCE(SUM(carteira_ativa), 0) AS carteira_ativa_total,
      COALESCE(
        SUM(carteira_inadimplencia) * 100.0 / NULLIF(SUM(carteira_ativa), 0), 
        0
      ) AS inadimplencia_media,
      MAX(data_base) AS data_base
    FROM dados_bcb
    WHERE 1=1
  `;

  const params = [];

  if (uf) {
    baseQuery += " AND uf = ?";
    params.push(uf);
  }

  if (tipo_cliente) {
    baseQuery += " AND tipo_cliente = ?";
    params.push(tipo_cliente);
  }

  db.get(baseQuery, params, (err, row) => {
    if (err) {
      console.error("Erro no banco:", err.message);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }

    return res.json({
      total_operacoes: Number(row.total_operacoes) || 0,
      carteira_ativa_total: Number(row.carteira_ativa_total) || 0,
      inadimplencia_media: Number((row.inadimplencia_media || 0).toFixed(2)),
      data_base: row.data_base || null,
    });
  });
}

router.get("/kpis", (req, res) => {
  const { uf, tipo_cliente } = req.query;

  if (uf) {
    const ufQuery = "SELECT 1 FROM dados_bcb WHERE uf = ? LIMIT 1";
    return db.get(ufQuery, [uf], (err, row) => {
      if (err) return res.status(500).json({ error: "Erro interno do servidor" });
      if (!row) return res.status(400).json({ error: "UF não encontrada" });

      executarKpi(res, uf, tipo_cliente);
    });
  }

  executarKpi(res, uf, tipo_cliente);
});

module.exports = router;
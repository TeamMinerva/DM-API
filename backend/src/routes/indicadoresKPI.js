const express = require("express");
const router = express.Router();
const db = require("../database/connection");

async function executarKpi(res, uf, tipo_cliente) {
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

  // No Postgres usamos $1, $2, etc.
  if (uf) {
    params.push(uf);
    baseQuery += ` AND uf = $${params.length}`;
  }

  if (tipo_cliente) {
    params.push(tipo_cliente);
    baseQuery += ` AND tipo_cliente = $${params.length}`;
  }

  try {
    const resultado = await db.query(baseQuery, params);
    const row = resultado.rows[0];

    return res.json({
      total_operacoes: Number(row.total_operacoes) || 0,
      carteira_ativa_total: Number(row.carteira_ativa_total) || 0,
      inadimplencia_media: Number(parseFloat(row.inadimplencia_media || 0).toFixed(2)),
      data_base: row.data_base || null,
    });
  } catch (err) {
    console.error("Erro no banco:", err.message);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

router.get("/kpis", async (req, res) => {
  const { uf, tipo_cliente } = req.query;

  try {
    if (uf) {
      const ufQuery = "SELECT 1 FROM dados_bcb WHERE uf = $1 LIMIT 1";
      const resultadoUf = await db.query(ufQuery, [uf]);
      
      if (resultadoUf.rows.length === 0) {
        return res.status(400).json({ error: "UF não encontrada" });
      }
    }

    await executarKpi(res, uf, tipo_cliente);
  } catch (err) {
    console.error("Erro na rota de KPIs:", err.message);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
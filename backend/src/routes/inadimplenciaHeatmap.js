const express = require("express");
const router = express.Router();
const db = require("../database/connection");

const TIPOS_VALIDOS = new Set(["PF", "PJ"]);

router.get("/heatmap", async (req, res) => {
  const tipo = String(req.query.tipo || "PF").toUpperCase();
  const tipoSanitizado = TIPOS_VALIDOS.has(tipo) ? tipo : "PF";

  const query = `
    WITH ufs AS (
      SELECT DISTINCT uf
      FROM dados_bcb
      WHERE uf IS NOT NULL
    ),
    portes AS (
      SELECT DISTINCT porte
      FROM dados_bcb
      WHERE cliente = $1
        AND porte IS NOT NULL
    ),
    taxas AS (
      SELECT
        uf,
        porte,
        SUM(carteira_inadimplencia) * 100.0 / NULLIF(SUM(carteira_ativa), 0) AS taxa_inadimplencia
      FROM dados_bcb
      WHERE cliente = $1
      GROUP BY uf, porte
    )
    SELECT
      ufs.uf,
      portes.porte,
      CASE
        WHEN taxas.taxa_inadimplencia IS NULL THEN NULL
        ELSE ROUND(taxas.taxa_inadimplencia::numeric, 2)
      END AS taxa_inadimplencia
    FROM ufs
    CROSS JOIN portes
    LEFT JOIN taxas
      ON taxas.uf = ufs.uf
      AND taxas.porte = portes.porte
    ORDER BY ufs.uf ASC, portes.porte ASC;
  `;

  try {
    const resultado = await db.query(query, [tipoSanitizado]);

    const dados = resultado.rows.map((row) => ({
      uf: row.uf,
      porte: row.porte,
      taxa_inadimplencia:
        row.taxa_inadimplencia === null
          ? null
          : Number(row.taxa_inadimplencia),
    }));

    return res.json(dados);
  } catch (err) {
    console.error("Erro ao buscar heatmap de inadimplencia:", err);
    return res
      .status(500)
      .json({ error: "Erro interno ao buscar heatmap de inadimplencia." });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../database/connection');

// Feature 6: Ativo problemático e inadimplência por macro-região
router.get('/indicadores', async (req, res) => {
    // 1. Descobre a data mais recente através de uma CTE
    // 2. Calcula as taxas só para essa data, agrupando por região
    const query = `
        WITH UltimaData AS (
            SELECT MAX(data_base) as max_data FROM dados_bcb
        )
        SELECT 
            CASE
                WHEN uf IN ('SP', 'RJ', 'MG', 'ES') THEN 'Sudeste'
                WHEN uf IN ('PR', 'SC', 'RS') THEN 'Sul'
                WHEN uf IN ('DF', 'GO', 'MT', 'MS') THEN 'Centro-Oeste'
                WHEN uf IN ('BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'PI', 'CE', 'MA') THEN 'Nordeste'
                WHEN uf IN ('AM', 'RR', 'AP', 'PA', 'TO', 'AC', 'RO') THEN 'Norte'
            END AS regiao,
            (SUM(ativo_problematico) * 100.0 / NULLIF(SUM(carteira_ativa), 0)) AS taxa_ativo_problematico,
            (SUM(carteira_inadimplencia) * 100.0 / NULLIF(SUM(carteira_ativa), 0)) AS taxa_inadimplencia
        FROM dados_bcb
        WHERE data_base = (SELECT max_data FROM UltimaData)
        GROUP BY regiao
        ORDER BY regiao ASC;
    `;

    try {
        // No Postgres, usamos await e os dados vêm no array .rows
        const resultado = await db.query(query);
        const rows = resultado.rows;

        // Mapeamos os resultados garantindo que valores nulos virem 0 
        // e que strings numéricas do Postgres sejam tratadas como float
        const resultados = rows.map(row => ({
            regiao: row.regiao,
            taxa_ativo_problematico: Number((parseFloat(row.taxa_ativo_problematico) || 0).toFixed(2)),
            taxa_inadimplencia: Number((parseFloat(row.taxa_inadimplencia) || 0).toFixed(2))
        }));

        res.json(resultados);

    } catch (err) {
        console.error("Erro ao consultar indicadores por região:", err);
        return res.status(500).json({ error: "Erro interno ao buscar indicadores regionais." });
    }
});

module.exports = router;

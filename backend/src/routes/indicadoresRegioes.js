const express = require('express');
const router = express.Router();
const db = require('../database/connection');

// Feature 6: Ativo problemático e inadimplência por macro-região
router.get('/indicadores', (req, res) => {
    // 1. Descobre a data mais recente
    // 2. Calcula as taxas só para essa data, agrupando por região
    const query = `
        WITH UltimaData AS (
            SELECT MAX(data_base) as max_data FROM dados_bcb
        )
        SELECT 
            regiao,
            (SUM(ativo_problematico) * 100.0 / NULLIF(SUM(carteira_ativa), 0)) AS taxa_ativo_problematico,
            (SUM(carteira_inadimplencia) * 100.0 / NULLIF(SUM(carteira_ativa), 0)) AS taxa_inadimplencia
        FROM dados_bcb
        WHERE data_base = (SELECT max_data FROM UltimaData)
        GROUP BY regiao
        ORDER BY regiao ASC;
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Erro ao consultar indicadores por região:", err);
            return res.status(500).json({ error: "Erro interno ao buscar indicadores regionais." });
        }

        // Converter nulls para 0 antes de devolver (exigência da tarefa)
        const resultados = rows.map(row => ({
            regiao: row.regiao,
            taxa_ativo_problematico: Number((row.taxa_ativo_problematico || 0).toFixed(2)),
            taxa_inadimplencia: Number((row.taxa_inadimplencia || 0).toFixed(2))
        }));

        res.json(resultados);
    });
});

module.exports = router;
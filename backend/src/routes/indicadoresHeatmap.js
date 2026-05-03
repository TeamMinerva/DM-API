const express = require('express');
const router = express.Router();
const db = require('../database/connection');

router.get('/inadimplencia', async (req, res) => {
    const tipo = String(req.query.tipo || 'PF').toUpperCase();

    if (!['PF', 'PJ'].includes(tipo)) {
        return res.status(400).json({ erro: 'tipo inválido, use PF ou PJ' });
    }

    const query = `
        SELECT
            uf,
            porte,
            ROUND(
                (SUM(carteira_inadimplencia) * 100.0 / NULLIF(SUM(carteira_ativa), 0))::numeric,
                2
            ) AS taxa_inadimplencia
        FROM dados_bcb
        WHERE cliente = $1
        GROUP BY uf, porte
        ORDER BY uf, porte;
    `;

    try {
        const resultado = await db.query(query, [tipo]);

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
        console.error('Erro ao buscar heatmap de inadimplência:', err);
        return res.status(500).json({ erro: 'Erro interno ao buscar heatmap de inadimplência.' });
    }
});

module.exports = router;

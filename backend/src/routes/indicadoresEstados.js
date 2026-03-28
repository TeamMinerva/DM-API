const express = require('express');
const router = express.Router();

const db = require('../database/connection'); 

router.get('/estados', (req, res) => {
    const query = `
        WITH CarteiraPorMes AS (
            SELECT 
                uf,
                data_base,
                SUM(carteira_ativa) AS carteira_ativa
            FROM dados_bcb
            GROUP BY uf, data_base
        ),
        MesesRankeados AS (
            SELECT
                uf,
                data_base,
                carteira_ativa,
                ROW_NUMBER() OVER(PARTITION BY uf ORDER BY data_base DESC) AS ranking
            FROM CarteiraPorMes
        )
        SELECT
            atual.uf,
            atual.carteira_ativa AS carteira_final,
            anterior.carteira_ativa AS carteira_inicial
        FROM MesesRankeados atual
        LEFT JOIN MesesRankeados anterior ON atual.uf = anterior.uf AND anterior.ranking = 7
        WHERE atual.ranking = 1;
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Erro ao consultar o banco de dados:", err);
            return res.status(500).json({ error: "Erro interno ao buscar dados dos estados." });
        }

        const resultados = rows.map(row => {
            const inicial = row.carteira_inicial;
            const final = row.carteira_final;
            let crescimento = 0;

            if (inicial && inicial > 0) {
                crescimento = ((final - inicial) / inicial) * 100;
            }

            return {
                uf: row.uf,
                carteira_ativa: Number(final).toFixed(2),
                crescimento: Number(crescimento.toFixed(2))
            };
        });

        res.json(resultados);
    });
});

module.exports = router;
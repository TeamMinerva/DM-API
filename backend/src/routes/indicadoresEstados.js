const express = require('express');
const router = express.Router();
const db = require('../database/connection');

// Rota para listagem e crescimento dos estados
router.get('/estados', async (req, res) => {
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
                ROW_NUMBER() OVER(PARTITION BY uf ORDER BY data_base DESC) AS ranking,
                ROW_NUMBER() OVER(PARTITION BY uf ORDER BY data_base ASC) AS ranking_asc
            FROM CarteiraPorMes
        )
        SELECT
            atual.uf,
            atual.carteira_ativa AS carteira_final,
            primeiro.carteira_ativa AS carteira_inicial
        FROM MesesRankeados atual
        LEFT JOIN MesesRankeados primeiro 
            ON atual.uf = primeiro.uf AND primeiro.ranking_asc = 1
        WHERE atual.ranking = 1;
    `;

    try {
        const result = await db.query(query);
        const rows = result.rows || [];

        const resultados = rows.map(row => {
            const inicial = row.carteira_inicial;
            const final = row.carteira_final;
            let crescimento = 0;

            if (inicial && inicial > 0) {
                crescimento = ((final - inicial) / inicial) * 100;
            }

            return {
                uf: row.uf,
                carteira_ativa: Number(final),
                crescimento: Number(crescimento.toFixed(2))
            };
        });

        res.json(resultados);
    } catch (err) {
        console.error("Erro ao consultar o banco de dados:", err);
        res.status(500).json({ error: "Erro interno ao buscar dados dos estados." });
    }
});

// Feature 1: Evolução da carteira ativa por estado (Gráfico de Linha)
router.get('/carteira-ativa/evolucao', async (req, res) => {
    const estadosQuery = req.query.estados;

    if (!estadosQuery) {
        return res.status(400).json({ 
            error: "Parâmetro 'estados' é obrigatório. Exemplo: ?estados=SP,RJ" 
        });
    }

    const estados = estadosQuery.split(',').map(e => e.trim().toUpperCase());

    if (estados.length < 2 || estados.length > 3) {
        return res.status(400).json({ 
            error: "Envie no mínimo 2 e no máximo 3 estados." 
        });
    }

    // No Postgres, usamos $1, $2, $3...
    const placeholders = estados.map((_, index) => `$${index + 1}`).join(',');
    const query = `
        SELECT 
            data_base, 
            uf, 
            SUM(carteira_ativa) AS carteira_ativa
        FROM dados_bcb
        WHERE uf IN (${placeholders})
        GROUP BY data_base, uf
        ORDER BY data_base ASC, uf ASC;
    `;

    try {
        const result = await db.query(query, estados);
        res.json(result.rows || []);
    } catch (err) {
        console.error("Erro na evolução da carteira:", err);
        res.status(500).json({ error: "Erro interno ao buscar evolução." });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../database/connection');

router.get('/estados', (req, res) => {
});

router.get('/carteira-ativa/ranking', (req, res) => {
    // Pega o parâmetro ?top=N da URL, se nao tiver usa 27 direto 
    const top = parseInt(req.query.top) || 27;

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
                /* LAG pega o valor da linha anterior (mês anterior) para a mesma UF */
                LAG(carteira_ativa) OVER(PARTITION BY uf ORDER BY data_base ASC) AS carteira_anterior,
                ROW_NUMBER() OVER(PARTITION BY uf ORDER BY data_base DESC) AS ranking_recente
            FROM CarteiraPorMes
        )
        SELECT
            uf,
            carteira_ativa AS valor_atual,
            COALESCE(carteira_anterior, 0) AS valor_anterior
        FROM MesesRankeados
        WHERE ranking_recente = 1 -- Filtra apenas o mês mais atual
        ORDER BY valor_atual DESC
        LIMIT ?;
    `;

    db.all(query, [top], (err, rows) => {
        if (err) {
            console.error("Erro ao consultar o banco de dados:", err);
            return res.status(500).json({ error: "Erro interno ao buscar ranking." });
        }

        const resultados = rows.map(row => {
            const atual = row.valor_atual || 0;
            const anterior = row.valor_anterior || 0;
            let crescimento = 0;

            // calculo da taxa de crescimento
            if (anterior > 0) {
                crescimento = ((atual - anterior) / anterior) * 100;
            }

            return {
                uf: row.uf,
                credito_ativo: Number(atual.toFixed(2)),
                taxa_crescimento: Number(crescimento.toFixed(2))
            };
        });

        res.json(resultados);
    });
});

module.exports = router;
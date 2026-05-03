const express = require('express');
const router = express.Router();
const db = require('../database/connection'); // Seu Pool do Postgres

router.get('/estados', async (req, res) => {
    try {
        const query = "SELECT DISTINCT uf FROM dados_bcb ORDER BY uf ASC";
        const resultado = await db.query(query);
        res.json(resultado.rows);
    } catch (err) {
        console.error("Erro ao buscar estados:", err);
        res.status(500).json({ error: "Erro interno ao buscar estados." });
    }
});

router.get('/carteira-ativa/ranking', async (req, res) => {
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
                FIRST_VALUE(carteira_ativa) OVER(PARTITION BY uf ORDER BY data_base ASC) AS carteira_anterior,
                ROW_NUMBER() OVER(PARTITION BY uf ORDER BY data_base DESC) AS ranking_recente
            FROM CarteiraPorMes
        )
        SELECT
            uf,
            carteira_ativa AS valor_atual,
            COALESCE(carteira_anterior, 0) AS valor_anterior
        FROM MesesRankeados
        WHERE ranking_recente = 1
        ORDER BY valor_atual DESC
        LIMIT $1;
    `;

    try {
        // No Postgres usamos await e os dados vêm em .rows
        const resultado = await db.query(query, [top]);

        const resultados = resultado.rows.map(row => {
            const atual = parseFloat(row.valor_atual) || 0;
            const anterior = parseFloat(row.valor_anterior) || 0;
            let crescimentoCalculado = 0;

            if (anterior > 0) {
                crescimentoCalculado = ((atual - anterior) / anterior) * 100;
            }

            return {
                uf: row.uf || "N/A",
                carteira_ativa: Number(atual.toFixed(2)),
                taxa_crescimento: Number(crescimentoCalculado.toFixed(2))
            };
        });

        res.json(resultados);

    } catch (err) {
        console.error("Erro ao consultar o banco de dados:", err);
        res.status(500).json({ error: "Erro interno ao buscar ranking." });
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
const express = require('express');
const router = express.Router();

const db = require('../database/connection'); 

router.get('/estados', (req, res) => {
    // Usamos ROW_NUMBER() para numerar os registros de cada UF do mais recente (1) para o mais antigo
    const query = `
        WITH MesesRankeados AS (
            SELECT 
                uf, 
                carteira_ativa,
                ROW_NUMBER() OVER(PARTITION BY uf ORDER BY data_base DESC) as ranking
            FROM dados_bcb
        )
        SELECT 
            atual.uf,
            atual.carteira_ativa AS carteira_ativa_atual,
            anterior.carteira_ativa AS carteira_ativa_anterior
        FROM MesesRankeados atual
        LEFT JOIN MesesRankeados anterior ON atual.uf = anterior.uf AND anterior.ranking = 2
        WHERE atual.ranking = 1;
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Erro ao consultar o banco de dados:", err);
            return res.status(500).json({ error: "Erro interno ao buscar dados dos estados." });
        }

        const resultados = rows.map(row => {
            const atual = row.carteira_ativa_atual;
            const anterior = row.carteira_ativa_anterior;
            let crescimento = 0;

            // Calcula o crescimento se houver dados do mês anterior (evita divisão por zero)
            if (anterior && anterior > 0) {
                crescimento = ((atual - anterior) / anterior) * 100;
            }

            return {
                uf: row.uf,
                carteira_ativa: Number(atual), 
                crescimento: Number(crescimento.toFixed(2)) // Arredonda para 2 casas decimais
            };
        });

        res.json(resultados);
    });
});

module.exports = router;
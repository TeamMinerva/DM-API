const express = require('express');
const router = express.Router();
const db = require('../database/connection');

router.get('/carteira', async (req, res) => {
    const query = `
    SELECT
      CASE
        WHEN uf IN ('SP', 'RJ', 'MG', 'ES') THEN 'Sudeste'
        WHEN uf IN ('PR', 'SC', 'RS') THEN 'Sul'
        WHEN uf IN ('DF', 'GO', 'MT', 'MS') THEN 'Centro-Oeste'
        WHEN uf IN ('BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'PI', 'CE', 'MA') THEN 'Nordeste'
        WHEN uf IN ('AM', 'RR', 'AP', 'PA', 'TO', 'AC', 'RO') THEN 'Norte'
      END AS regiao,
      SUM(carteira_ativa) AS carteira_ativa
    FROM dados_bcb
    GROUP BY 1 -- Agrupa pela primeira coluna (o CASE)
    ORDER BY regiao ASC
  `;

    try {
        const resultadoDb = await db.query(query);
        const rows = resultadoDb.rows;

        // Calculamos o total geral para a porcentagem
        // parseFloat é necessário porque o Postgres retorna SUM como string
        const carteiraTotal = rows.reduce((total, row) => {
            return total + (parseFloat(row.carteira_ativa) || 0);
        }, 0);

        const resultado = {};
        
        rows.forEach(row => {
            const valorRegiao = parseFloat(row.carteira_ativa) || 0;
            // Mantendo o formato original: valor como string com 2 casas decimais
            resultado[row.regiao] = carteiraTotal > 0 
                ? (valorRegiao / carteiraTotal * 100).toFixed(2) 
                : "0.00";
        });

        res.json(resultado);

    } catch (err) {
        console.error("Erro em regioesCarteira:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
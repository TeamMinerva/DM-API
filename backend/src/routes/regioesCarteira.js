const express = require('express');
const router = express.Router();
const db = require('../database/connection');

router.get('/carteira', (req, res) => {
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
    GROUP BY 
    CASE
    WHEN uf IN ('SP', 'RJ', 'MG', 'ES') THEN 'Sudeste'
    WHEN uf IN ('PR', 'SC', 'RS') THEN 'Sul'
    WHEN uf IN ('DF', 'GO', 'MT', 'MS') THEN 'Centro-Oeste'
    WHEN uf IN ('BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'PI', 'CE', 'MA') THEN 'Nordeste'
    WHEN uf IN ('AM', 'RR', 'AP', 'PA', 'TO', 'AC', 'RO') THEN 'Norte'
    END
    ORDER BY regiao ASC
  `;
    db.all(query, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const carteiraTotal = rows.reduce((total, row) => total + row.carteira_ativa, 0);

        const resultado = {}
        rows.forEach(row => {
            resultado[row.regiao] = (row.carteira_ativa/carteiraTotal * 100).toFixed(2);
        });
        res.json(resultado);
    });
});
module.exports = router
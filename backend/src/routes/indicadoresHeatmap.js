const express = require('express');
const router = express.Router();
const db = require('../database/connection');

router.get('/inadimplencia', (req, res) => {
    const tipo = req.query.tipo ?? 'PF'
    const tipo_cliente = req.query.tipo_cliente ?? 'CDE'

    if (!['PF', 'PJ'].includes(tipo)) {
        return res.status(400).json({ erro: 'tipo inválido, use PF ou PJ' })
    }

    const portes_ab = [
        'Acima de 20 salários mínimos',
        'Mais de 10 a 20 salários mínimos'
    ]

    const portes_cde = [
        'Até 1 salário mínimo',
        'Mais de 1 a 2 salários mínimos',
        'Mais de 2 a 3 salários mínimos',
        'Mais de 3 a 5 salários mínimos',
        'Mais de 5 a 10 salários mínimos',
        'Sem rendimento'
    ]

    let query = `
        SELECT
            uf,
            porte,
            ROUND(
                SUM(carteira_inadimplencia) / NULLIF(SUM(carteira_ativa), 0) * 100,
                2
            ) AS taxa_inadimplencia
        FROM dados_bcb
        WHERE cliente = ?
    `

    const params = [tipo]

    if (tipo === 'PF') {
        if (!['AB', 'CDE'].includes(tipo_cliente)) {
            return res.status(400).json({ erro: 'tipo_cliente inválido, use AB ou CDE' })
        }

        const portes = tipo_cliente === 'AB' ? portes_ab : portes_cde
        const placeholders = portes.map(() => '?').join(', ')
        query += ` AND porte IN (${placeholders})`
        params.push(...portes)
    }

    query += ` GROUP BY uf, porte ORDER BY uf, porte`

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ erro: err.message })
        }
        res.json(rows)
    })
})

module.exports = router;
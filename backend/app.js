const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

app.get('/kpis', (req, res) => {
    const { uf, tipo_cliente } = req.query;

    if (uf) {
        const ufExists = db.prepare('SELECT 1 FROM indicadores WHERE uf = ? LIMIT 1').get(uf);
        if (!ufExists) return res.status(400).json({ error: "UF não encontrada" });
    }

    let baseQuery = `
        SELECT 
            COALESCE(SUM(operacoes), 0) AS total_operacoes,
            COALESCE(SUM(carteira_ativa), 0) AS carteira_ativa_total,
            COALESCE(AVG(inadimplencia), 0) AS inadimplencia_media,
            MAX(data_base) AS data_base
        FROM indicadores
        WHERE 1=1
    `;
    
    const params = [];

    if (uf) {
        baseQuery += ' AND uf = ?';
        params.push(uf);
    }
    if (tipo_cliente) {
        baseQuery += ' AND tipo_cliente = ?';
        params.push(tipo_cliente);
    }

    try {
        const row = db.prepare(baseQuery).get(...params);
        
        const result = {
            total_operacoes: Number(row.total_operacoes) || 0,
            carteira_ativa_total: Number(row.carteira_ativa_total) || 0,
            inadimplencia_media: Number((row.inadimplencia_media || 0).toFixed(2)),
            data_base: row.data_base || "2024-06" 
        };

        return res.json(result);
    } catch (error) {
        console.error("Erro no banco:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
const express = require("express");
const router = express.Router();
const db = require("../database/connection");

// Indicador nacional: Inadimplência
router.get("/inadimplencia", async (req, res) => {
  const query = `
    SELECT 
      SUM(carteira_inadimplencia) as inadimplencia,
      SUM(carteira_ativa) as total
    FROM dados_bcb
  `;

  try {
    const resultado = await db.query(query);
    const row = resultado.rows[0];

    const inad = parseFloat(row.inadimplencia) || 0;
    const total = parseFloat(row.total) || 0;
    const taxa = total > 0 ? (inad / total) * 100 : 0;

    res.json({
      taxa_inadimplencia: Number(taxa.toFixed(2))
    });
  } catch (err) {
    console.error("Erro na inadimplência:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Indicador nacional: Ativo Problematico
router.get("/ativo-problema", async (req, res) => {
  const query = `
    SELECT
      SUM(ativo_problematico) as ativo_problema,
      SUM(carteira_ativa) as total
    FROM dados_bcb
  `;
  try {
    const resultado = await db.query(query);
    const row = resultado.rows[0];

    const ativoProblema = parseFloat(row.ativo_problema) || 0;
    const total = parseFloat(row.total) || 0;
    const taxa = total > 0 ? (ativoProblema / total) * 100 : 0;

    res.json({
      taxa_ativo_problema: Number(taxa.toFixed(2))
    });
  } catch (err) {
    console.error("Erro em ativo problema:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Total de Operações
router.get("/operacoes", async (req, res) => {
  const query = `
    SELECT SUM(numero_de_operacoes) as total_operacoes
    FROM dados_bcb
  `;

  try {
    const resultado = await db.query(query);
    const row = resultado.rows[0];

    res.json({
      total_operacoes: parseInt(row.total_operacoes) || 0
    });
  } catch (err) {
    console.error("Erro em operações:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Carteira Total
router.get("/carteira", async (req, res) => {
  const query = `
    SELECT SUM(carteira_ativa) as carteira_total
    FROM dados_bcb
  `;

  try {
    const resultado = await db.query(query);
    const row = resultado.rows[0];

    res.json({
      carteira_total: parseFloat(row.carteira_total) || 0
    });
  } catch (err) {
    console.error("Erro em carteira:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Crescimento Nacional
router.get("/crescimento", async (req, res) => {
  const query = `
    SELECT 
      data_base,
      SUM(carteira_ativa) as total
    FROM dados_bcb
    GROUP BY data_base
    ORDER BY data_base ASC
  `;

  try {
    const resultado = await db.query(query);
    const rows = resultado.rows;

    // Mantendo a lógica de retornar crescimento_carteira: null se houver menos de 2 meses
    if (rows.length < 2) {
      return res.json({ crescimento_carteira: null });
    }

    const primeiro = parseFloat(rows[0].total) || 0;
    const ultimo = parseFloat(rows[rows.length - 1].total) || 0;

    let crescimento = 0;
    if (primeiro > 0) {
      crescimento = ((ultimo - primeiro) / primeiro) * 100;
    }

    res.json({
      crescimento_carteira: Number(crescimento.toFixed(2))
    });
  } catch (err) {
    console.error("Erro em crescimento:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/regioes", async (req, res) => {
  const query = `
    SELECT
      CASE
        WHEN uf IN ('SP', 'RJ', 'MG', 'ES') THEN 'Sudeste'
        WHEN uf IN ('PR', 'SC', 'RS') THEN 'Sul'
        WHEN uf IN ('DF', 'GO', 'MT', 'MS') THEN 'Centro-Oeste'
        WHEN uf IN ('BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'PI', 'CE', 'MA') THEN 'Nordeste'
        WHEN uf IN ('AM', 'RR', 'AP', 'PA', 'TO', 'AC', 'RO') THEN 'Norte'
      END AS regiao,
      SUM(carteira_inadimplencia) AS carteira_inadimplencia,
      SUM(carteira_ativa) AS carteira_ativa
    FROM dados_bcb
    GROUP BY 1 -- Agrupa pela primeira coluna (o CASE)
    ORDER BY regiao ASC
  `;

  try {
    const resultado = await db.query(query);
    const rows = resultado.rows;

    const carteiraTotal = rows.reduce((total, row) => {
            return total + (parseFloat(row.carteira_ativa) || 0);
        }, 0);
    const formatado = rows.map(row => {
      const inad = parseFloat(row.carteira_inadimplencia) || 0;
      const total = parseFloat(row.carteira_ativa) || 0;
      const taxa = total > 0 ? (inad / total) * 100 : 0;
      return {
        regiao: row.regiao,
        taxa_inadimplencia: Number(taxa.toFixed(2))
      };
    });
    const menor = formatado.reduce((min, item) => item.taxa_inadimplencia < min.taxa_inadimplencia ? item : min, formatado[0]);
    const maior = formatado.reduce((max, item) => item.taxa_inadimplencia > max.taxa_inadimplencia ? item : max, formatado[0]);
    const resultadoFinal = {
      menor_inadimplencia: menor.regiao,
      maior_inadimplencia: maior.regiao
    };

    res.json(resultadoFinal);
  } catch (err) {
    console.error("Erro em regiões:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();

function obterCategoriaPorScore(score) {
  if (score >= 75) return 'Alta';
  if (score >= 50) return 'Media-Alta';
  if (score >= 25) return 'Moderada';
  return 'Baixa';
}

const listaUFsObrigatorias = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

async function obterScoresMockados() {
  return [
    { uf: 'SP', score_total: 92.45 },
    { uf: 'RJ', score_total: 78.2 },
    { uf: 'MG', score_total: 64.8 },
    { uf: 'PR', score_total: 52.35 },
    { uf: 'BA', score_total: 41.9 },
    { uf: 'PE', score_total: 33.4 },
    { uf: 'GO', score_total: 27.75 },
    { uf: 'AM', score_total: 18.5 },
    { uf: 'AC', score_total: 8.1 }
  ];
}

router.get('/api/mapa/oportunidade', async (req, res) => {
  try {
    const dadosScores = await obterScoresMockados();

    const respostaBase = listaUFsObrigatorias.map(uf => {
      const estadoDados = dadosScores.find(item => item.uf && item.uf.trim().toUpperCase() === uf);
      const scoreTotal = estadoDados ? parseFloat(estadoDados.score_total) || 0 : 0;

      return {
        uf,
        score_total: Number(scoreTotal.toFixed(2)),
        categoria: obterCategoriaPorScore(scoreTotal)
      };
    });

    const resposta = respostaBase
      .sort((a, b) => b.score_total - a.score_total)
      .map((item, index) => ({
        ...item,
        ranking: index + 1
      }));

    return res.status(200).json(resposta);
  } catch (error) {
    console.error('Erro na rota do mapa de oportunidade:', error);
    return res.status(500).json({ error: 'Erro interno ao processar dados do mapa de oportunidade.' });
  }
});

module.exports = router;

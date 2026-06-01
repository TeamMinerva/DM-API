const express = require('express');
const router = express.Router();
const { obterRankingScoreCompleto } = require('../database/queries/ranking');

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

router.get('/api/mapa/oportunidade', async (req, res) => {
  try {
    const rankingScore = await obterRankingScoreCompleto();

    const respostaBase = listaUFsObrigatorias.map(uf => {
      const estadoDados = rankingScore.find(item => item.uf && item.uf.trim().toUpperCase() === uf);
      const scoreTotal = estadoDados ? parseFloat(estadoDados.score) || 0 : 0;

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

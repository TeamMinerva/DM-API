const express = require('express');
const router = express.Router();


function obterCategoriaPorScore(score) {
  if (score >= 75) return 'Alta';
  if (score >= 50) return 'Média-Alta';
  if (score >= 25) return 'Moderada';
  return 'Baixa';
}

router.get('/api/mapa/oportunidade', async (req, res) => {
  try {
    const listaUFs = [
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
      'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
      'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    const resposta = listaUFs.map(uf => {
      const scoreTotal = Math.floor(Math.random() * 100); 

      return {
        uf: uf,
        score_total: scoreTotal,
        categoria: obterCategoriaPorScore(scoreTotal)
      };
    });

    return res.status(200).json(resposta);

  } catch (error) {
    console.error('Erro na rota do mapa de oportunidade:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
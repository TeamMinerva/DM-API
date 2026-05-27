const express = require('express');
const router = express.Router();
const db = require('../database/connection'); 


function obterCategoriaPorScore(score) {
  if (score >= 75) return 'Alta';
  if (score >= 50) return 'Média-Alta';
  if (score >= 25) return 'Moderada';
  return 'Baixa';
}


router.get('/api/mapa/oportunidade', async (req, res) => {
  try {

    const query = `
      WITH UltimosDados AS (
        SELECT 
          uf,
          SUM(carteira_ativa) AS total_carteira,
          ROW_NUMBER() OVER(PARTITION BY uf ORDER BY data_base DESC) AS ranking_recente
        FROM dados_bcb
        GROUP BY uf, data_base
      )
      SELECT uf, total_carteira
      FROM UltimosDados
      WHERE ranking_recente = 1;
    `;

    const resultado = await db.query(query);
    const dadosBanco = resultado.rows;


    const maiorCarteira = dadosBanco.length > 0 
      ? Math.max(...dadosBanco.map(item => parseFloat(item.total_carteira) || 0)) 
      : 1;


    const listaUFsObrigatorias = [
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
      'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
      'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];


    const resposta = listaUFsObrigatorias.map(uf => {

      const estadoDados = dadosBanco.find(item => item.uf && item.uf.trim().toUpperCase() === uf);
      const carteiraEstado = estadoDados ? parseFloat(estadoDados.total_carteira) || 0 : 0;


      let scoreTotal = (carteiraEstado / maiorCarteira) * 100;
      scoreTotal = Number(scoreTotal.toFixed(2)); 

      return {
        uf: uf,
        score_total: scoreTotal,
        categoria: obterCategoriaPorScore(scoreTotal)
      };
    });

    return res.status(200).json(resposta);

  } catch (error) {
    console.error('Erro na rota do mapa de oportunidade com banco real:', error);
    return res.status(500).json({ error: 'Erro interno ao processar dados do mapa de oportunidade.' });
  }
});

module.exports = router;
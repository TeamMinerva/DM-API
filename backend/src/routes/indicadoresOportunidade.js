const express = require('express');
const router = express.Router();
const { obterRankingScoreCompleto } = require('../database/queries/ranking');

router.get('/kpis-score', async (req, res) => {
    try {
        const ranking = await obterRankingScoreCompleto();

        if (!ranking || ranking.length === 0) {
            return res.status(404).json({ erro: 'Nenhum dado encontrado.' });
        }

        const maiorScore = ranking[0];

        const maiorDinamismo = ranking.reduce((a, b) =>
            parseFloat(a.dinamismo) > parseFloat(b.dinamismo) ? a : b
        );
        const menorDinamismo = ranking.reduce((a, b) =>
            parseFloat(a.dinamismo) < parseFloat(b.dinamismo) ? a : b
        );

        const estadosAcima75 = ranking.filter(
            (uf) => parseFloat(uf.score_total) > 75
        ).length;


        const ESTADOS = {
            AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas',
            BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo',
            GO: 'Goiás', MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul',
            MG: 'Minas Gerais', PA: 'Pará', PB: 'Paraíba', PR: 'Paraná',
            PE: 'Pernambuco', PI: 'Piauí', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte',
            RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina',
            SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins'
        };

        const nomear = (sigla) => ESTADOS[sigla?.toUpperCase()] ?? sigla;

        res.json({
            estados_score_acima_75: estadosAcima75,
            estados_score_acima_75_lista: ranking
                .filter(uf => parseFloat(uf.score_total) > 75)
                .map(uf => nomear(uf.uf)),
            estado_maior_score: nomear(maiorScore.uf),
            estado_maior_dinamismo: nomear(maiorDinamismo.uf),
            estado_menor_dinamismo: nomear(menorDinamismo.uf),
});
    } catch (erro) {
        console.error('Erro ao calcular KPIs de score:', erro);
        res.status(500).json({ erro: 'Erro interno ao calcular KPIs.' });
    }
});

module.exports = router;
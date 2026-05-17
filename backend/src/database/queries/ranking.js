const express = require('express');
const router = express.Router();
const db = require('../connection');

async function obterRankingScoreCompleto() {
    const query = `
        WITH ComponentesBrutos AS (
            -- Camada 1: Calcula as 4 métricas base por UF e mês
            SELECT 
                uf,
                data_base,
                -- 1. Qualidade = 1 - (Inadimplência / Carteira Ativa)
                1 - (SUM(carteira_inadimplencia) / NULLIF(SUM(carteira_ativa), 0)) AS qualidade_bruta,
                -- 2. Solidez = 1 - (Ativo Problemático / Carteira Ativa)
                1 - (SUM(ativo_problematico) / NULLIF(SUM(carteira_ativa), 0)) AS solidez_bruta,
                -- 3. Eficiência = Carteira Ativa / Número de Operações
                SUM(carteira_ativa) / NULLIF(SUM(numero_de_operacoes), 0) AS eficiencia_bruta,
                -- Guardamos a carteira ativa para calcular o dinamismo na sequência
                SUM(carteira_ativa) AS carteira_atual
            FROM dados_bcb
            WHERE uf NOT IN ('BR', 'TOTAL') -- Filtra agrupamentos nacionais se houver na coluna UF
            GROUP BY uf, data_base
        ),
        DinamismoCalculado AS (
            -- Camada 2: Calcula o crescimento (Dinamismo) comparando o mês atual com o anterior (LAG)
            -- E filtra apenas o período mais recente (ROW_NUMBER)
            SELECT 
                uf,
                qualidade_bruta,
                solidez_bruta,
                eficiencia_bruta,
                (carteira_atual - LAG(carteira_atual) OVER(PARTITION BY uf ORDER BY data_base ASC)) 
                    / NULLIF(LAG(carteira_atual) OVER(PARTITION BY uf ORDER BY data_base ASC), 0) AS dinamismo_bruto,
                ROW_NUMBER() OVER(PARTITION BY uf ORDER BY data_base DESC) AS rnk
            FROM ComponentesBrutos
        ),
        FiltroRecente AS (
            -- Mantém apenas o último mês processado de cada estado
            SELECT uf, qualidade_bruta, solidez_bruta, eficiencia_bruta, COALESCE(dinamismo_bruto, 0) AS dinamismo_bruto
            FROM DinamismoCalculado
            WHERE rnk = 1
        ),
        EstatisticasGlobais AS (
            -- Camada 3: Calcula a Média (AVG) e o Desvio Padrão (STDDEV) do grupo dos 27 estados
            SELECT 
                AVG(qualidade_bruta) AS avg_q, STDDEV(qualidade_bruta) AS std_q,
                AVG(solidez_bruta) AS avg_s,   STDDEV(solidez_bruta) AS std_s,
                AVG(eficiencia_bruta) AS avg_e, STDDEV(eficiencia_bruta) AS std_e,
                AVG(dinamismo_bruto) AS avg_d,  STDDEV(dinamismo_bruto) AS std_d
            FROM FiltroRecente
        ),
        ZScores AS (
            -- Camada 4: Aplica o cálculo do Z-Score individual (X - Média) / Desvio
            SELECT 
                f.uf,
                (f.qualidade_bruta - e.avg_q) / NULLIF(e.std_q, 0) AS z_q,
                (f.solidez_bruta - e.avg_s) / NULLIF(e.std_s, 0) AS z_s,
                (f.eficiencia_bruta - e.avg_e) / NULLIF(e.std_e, 0) AS z_e,
                (f.dinamismo_bruto - e.avg_d) / NULLIF(e.std_d, 0) AS z_d
            FROM FiltroRecente f, EstatisticasGlobais e
        ),
        LimitesMinMax AS (
            -- Camada 5: Encontra os limites máximos e mínimos globais de Z-Score para a escala 0-100
            SELECT 
                MIN(z_q) AS min_zq, MAX(z_q) AS max_zq,
                MIN(z_s) AS min_zs, MAX(z_s) AS max_zs,
                MIN(z_e) AS min_ze, MAX(z_e) AS max_ze,
                MIN(z_d) AS min_zd, MAX(z_d) AS max_zd
            FROM ZScores
        ),
        ScoresNormalizados AS (
            -- Camada 6: Normaliza cada componente para a escala de 0 a 100
            SELECT 
                z.uf,
                ((z.z_q - l.min_zq) / NULLIF(l.max_zq - l.min_zq, 0)) * 100 AS qualidade,
                ((z.z_s - l.min_zs) / NULLIF(l.max_zs - l.min_zs, 0)) * 100 AS solidez,
                ((z.z_e - l.min_ze) / NULLIF(l.max_ze - l.min_ze, 0)) * 100 AS eficiencia,
                ((z.z_d - l.min_zd) / NULLIF(l.max_zd - l.min_zd, 0)) * 100 AS dinamismo
            FROM ZScores z, LimitesMinMax l
        )
        -- Camada Final: Aplica os pesos de negócio ponderados e gera o Score Total
        SELECT 
            uf,
            ROUND(CAST(qualidade AS numeric), 2) AS qualidade,
            ROUND(CAST(solidez AS numeric), 2) AS solidez,
            ROUND(CAST(eficiencia AS numeric), 2) AS eficiencia,
            ROUND(CAST(dinamismo AS numeric), 2) AS dinamismo,
            ROUND(CAST(
                (qualidade * 0.35) + 
                (solidez * 0.30) + 
                (dinamismo * 0.25) + 
                (eficiencia * 0.10) 
            AS numeric), 2) AS score_total
        FROM ScoresNormalizados
        ORDER BY score_total DESC;
    `;

    const resultado = await db.query(query);
    return resultado.rows;
}

module.exports = { obterRankingScoreCompleto };
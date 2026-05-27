const express = require('express');
const router = require('express').Router();
const db = require('../connection');

async function obterRankingScoreCompleto() {
    const query = `
        WITH BaseEstadoData AS (
            -- Passo 1: Agrupa por UF e Mês (Igual ao seu primeiro .groupby e .agg)
            SELECT 
                uf,
                data_base,
                SUM(carteira_ativa)::numeric AS carteira_ativa,
                SUM(carteira_inadimplencia)::numeric AS carteira_inadimplencia,
                SUM(ativo_problematico)::numeric AS ativo_problematico,
                SUM(numero_de_operacoes)::numeric AS numero_de_operacoes
            FROM dados_bcb
            WHERE uf NOT IN ('BR', 'TOTAL')
            GROUP BY uf, data_base
        ),
        FiltroPeriodos AS (
            -- Passo 2: Mapeia o primeiro (.first()) e o último (.last()) mês de cada UF após ordenar
            SELECT 
                uf,
                data_base,
                carteira_ativa,
                carteira_inadimplencia,
                ativo_problematico,
                numero_de_operacoes,
                ROW_NUMBER() OVER(PARTITION BY uf ORDER BY data_base ASC) AS rnk_primeiro,
                ROW_NUMBER() OVER(PARTITION BY uf ORDER BY data_base DESC) AS rnk_ultimo
            FROM BaseEstadoData
        ),
        PeriodoAtual AS (
            -- Equivalente ao seu 'periodo_atual' (.last())
            SELECT 
                uf,
                data_base AS data_atual,
                carteira_ativa AS carteira_ativa_atual,
                carteira_inadimplencia AS carteira_inadimplencia_atual,
                ativo_problematico AS ativo_problematico_atual,
                numero_de_operacoes AS numero_de_operacoes_atual
            FROM FiltroPeriodos
            WHERE rnk_ultimo = 1
        ),
        PeriodoAnterior AS (
            -- Equivalente ao seu 'periodo_anterior' (.first())
            SELECT 
                uf,
                data_base AS data_anterior,
                carteira_ativa AS carteira_ativa_anterior
            FROM FiltroPeriodos
            WHERE rnk_primeiro = 1
        ),
        ScoreOriginal AS (
            -- Passo 3: Filtro INNER JOIN mantendo a escala decimal original (0 a 1) do Colab
            SELECT 
                atual.uf,
                atual.data_atual,
                ant.data_anterior,
                atual.carteira_ativa_atual,
                ant.carteira_ativa_anterior,
                -- Escala decimal idêntica ao Python
                (1 - (atual.carteira_inadimplencia_atual / NULLIF(atual.carteira_ativa_atual, 0))) AS qualidade,
                (1 - (atual.ativo_problematico_atual / NULLIF(atual.carteira_ativa_atual, 0))) AS solidez,
                ((atual.carteira_ativa_atual - ant.carteira_ativa_anterior) / NULLIF(ant.carteira_ativa_anterior, 0)) AS dinamismo,
                (atual.carteira_ativa_atual / NULLIF(atual.numero_de_operacoes_atual, 0)) AS eficiencia
            FROM PeriodoAtual atual
            JOIN PeriodoAnterior ant ON atual.uf = ant.uf
            WHERE atual.carteira_ativa_atual > 0 
              AND ant.carteira_ativa_anterior > 0 
              AND atual.numero_de_operacoes_atual > 0
        ),
        EstatisticasGlobais AS (
            -- Passo 4: STDDEV_POP garante ddof=0 do NumPy/Pandas sobre a escala correta
            SELECT 
                AVG(qualidade) AS avg_q, STDDEV_POP(qualidade) AS std_q,
                AVG(solidez) AS avg_s,   STDDEV_POP(solidez) AS std_s,
                AVG(dinamismo) AS avg_d,  STDDEV_POP(dinamismo) AS std_d,
                AVG(eficiencia) AS avg_e, STDDEV_POP(eficiencia) AS std_e
            FROM ScoreOriginal
        ),
        ZScores AS (
            -- Passo 5: Geração de Z-Scores sem distorções de escala
            SELECT 
                s.uf,
                s.qualidade,
                s.solidez,
                s.dinamismo,
                s.eficiencia,
                (s.qualidade - e.avg_q) / NULLIF(e.std_q, 0) AS z_q,
                (s.solidez - e.avg_s) / NULLIF(e.std_s, 0) AS z_s,
                (s.dinamismo - e.avg_d) / NULLIF(e.std_d, 0) AS z_d,
                (s.eficiencia - e.avg_e) / NULLIF(e.std_e, 0) AS z_e
            FROM ScoreOriginal s, EstatisticasGlobais e
        ),
        LimitesMinMax AS (
            -- Passo 6: Limites Min/Max dos Z-Scores
            SELECT 
                MIN(z_q) AS min_zq, MAX(z_q) AS max_zq,
                MIN(z_s) AS min_zs, MAX(z_s) AS max_zs,
                MIN(z_d) AS min_zd, MAX(z_d) AS max_zd,
                MIN(z_e) AS min_ze, MAX(z_e) AS max_ze
            FROM ZScores
        ),
        ScoresNormalizados AS (
            -- Passo 7: Normalização linear de 0 a 100 baseada na série tratada
            SELECT 
                z.uf,
                z.qualidade,
                z.solidez,
                z.dinamismo,
                z.eficiencia,
                ((z.z_q - l.min_zq) / NULLIF(l.max_zq - l.min_zq, 0)) * 100 AS q_norm,
                ((z.z_s - l.min_zs) / NULLIF(l.max_zs - l.min_zs, 0)) * 100 AS s_norm,
                ((z.z_d - l.min_zd) / NULLIF(l.max_zd - l.min_zd, 0)) * 100 AS d_norm,
                ((z.z_e - l.min_ze) / NULLIF(l.max_ze - l.min_ze, 0)) * 100 AS e_norm
            FROM ZScores z, LimitesMinMax l
        )
        -- Passo Final: Multiplicação visual por 100 apenas na saída para o front-end
        SELECT 
            uf,
            ROUND(CAST(qualidade * 100 AS numeric), 2) AS qualidade,
            ROUND(CAST(solidez * 100 AS numeric), 2) AS solidez,
            ROUND(CAST(dinamismo * 100 AS numeric), 2) AS dinamismo,
            ROUND(CAST(eficiencia AS numeric), 2) AS eficiencia,
            ROUND(CAST(
                (COALESCE(q_norm, 0) * 0.35) + 
                (COALESCE(s_norm, 0) * 0.30) + 
                (COALESCE(d_norm, 0) * 0.25) + 
                (COALESCE(e_norm, 0) * 0.10) 
            AS numeric), 2) AS score
        FROM ScoresNormalizados
        ORDER BY score DESC;
    `;

    const resultado = await db.query(query);
    return resultado.rows;
}

module.exports = { obterRankingScoreCompleto };
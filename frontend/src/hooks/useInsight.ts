import type { EstadoData } from './useEstados'

const REGIOES: Record<string, string> = {
  AC: 'Norte', AM: 'Norte', AP: 'Norte', PA: 'Norte', RO: 'Norte', RR: 'Norte', TO: 'Norte',
  AL: 'Nordeste', BA: 'Nordeste', CE: 'Nordeste', MA: 'Nordeste', PB: 'Nordeste',
  PE: 'Nordeste', PI: 'Nordeste', RN: 'Nordeste', SE: 'Nordeste',
  DF: 'Centro-Oeste', GO: 'Centro-Oeste', MS: 'Centro-Oeste', MT: 'Centro-Oeste',
  ES: 'Sudeste', MG: 'Sudeste', RJ: 'Sudeste', SP: 'Sudeste',
  PR: 'Sul', RS: 'Sul', SC: 'Sul',
}

function classificarMaturidade(estados: EstadoData[]): Record<string, 'consolidado' | 'emergente'> {
  console.log(estados)
  const valores = [...estados].map(e => e.carteira_ativa).sort((a, b) => a - b)
  const meio = Math.floor(valores.length / 2)
  const mediana = valores.length % 2 !== 0
    ? valores[meio]
    : (valores[meio - 1] + valores[meio]) / 2

  return Object.fromEntries(
    estados.map(e => [e.uf, e.carteira_ativa >= mediana ? 'consolidado' : 'emergente'])
  ) as Record<string, 'consolidado' | 'emergente'>
}

function listarRegioes(top3: EstadoData[]): { str: string; count: number } {
  const regioes = [...new Set(top3.map(e => REGIOES[e.uf] ?? e.uf))]
  const str = regioes.length === 1
    ? regioes[0]
    : `${regioes.slice(0, -1).join(', ')} e ${regioes.at(-1)}`
  return { str, count: regioes.length }
}

function gerarSegundoParagrafo(
  top3: EstadoData[],
  maturidade: Record<string, 'consolidado' | 'emergente'>,
  crescimentoNacional: number
): string {
  const emergentes = top3.filter(e => maturidade[e.uf] === 'emergente')
  const consolidados = top3.filter(e => maturidade[e.uf] === 'consolidado')

  const nomesEmergentes = emergentes.map(e => e.uf).join(', ')
  const nomesConsolidados = consolidados.map(e => e.uf).join(', ')

  if (emergentes.length === 3) {
    return `O avanço é puxado por estados ainda subexplorados como ${nomesEmergentes}, que partem de uma base menor e apresentam maior margem para expansão de crédito.`
  }

  if (consolidados.length === 3) {
    return `Mesmo mercados consolidados como ${nomesConsolidados} sustentam crescimento acima da média nacional de ${crescimentoNacional}%, sinalizando aquecimento generalizado da demanda por crédito no país.`
  }

  const verboParte = emergentes.length === 1 ? 'parte' : 'partem'
  const verbomantem = consolidados.length === 1 ? 'mantém' : 'mantêm'
  const perfilConsolidado = consolidados.length === 1 ? 'sendo um mercado consolidado' : 'sendo mercados consolidados'

  return `O avanço reflete dinâmicas distintas: ${nomesEmergentes} ${verboParte} de uma base menor, com maior margem para expansão de crédito. ${nomesConsolidados}, mesmo ${perfilConsolidado}, ${verbomantem} crescimento expressivo, indicando aquecimento generalizado da demanda por crédito no país.`
}

export function useInsight(estados: EstadoData[], crescimentoNacional: number | null): string {
  if (!estados.length || crescimentoNacional === null) return ''

  const maturidade = classificarMaturidade(estados)
  const sorted = [...estados].sort((a, b) => b.taxa_crescimento - a.taxa_crescimento)
  const top3 = sorted.slice(0, 3)

  const { str: regiaoStr, count: regiaoCount } = listarRegioes(top3)
  const verbo = regiaoCount === 1 ? 'lidera' : 'lideram'
  const destaques = top3.map(e => `${e.uf} (+${(e.taxa_crescimento || 0).toFixed(1)}%)`).join(', ')

  const primeiroParagrafo = `${regiaoStr} ${verbo} o crescimento da carteira ativa no período, com destaque para ${destaques}, todos acima da média nacional de ${crescimentoNacional}%.`
  const segundoParagrafo = gerarSegundoParagrafo(top3, maturidade, crescimentoNacional)

  return `${primeiroParagrafo}\n\n${segundoParagrafo}`
}
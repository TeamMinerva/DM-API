import { useEffect, useState } from 'react'

const API_BASE = 'http://localhost:3000'

interface ExpansaoKpisData {
  estadosScoreAcima75: string
  estadosScoreAcima75Lista: string
  estadoMaiorScore: string
  estadoMaiorDinamismo: string
  estadoMenorDinamismo: string
}

interface ExpansaoKpisState {
  data: ExpansaoKpisData | null
  loading: boolean
  error: string | null
}

export function useExpansaoKpis(): ExpansaoKpisState {
  const [state, setState] = useState<ExpansaoKpisState>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    fetch(`${API_BASE}/oportunidades/kpis-score`)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar KPIs de expansão')
        return res.json()
      })
      .then(data => setState({
        data: {
          estadosScoreAcima75: `${data.estados_score_acima_75} Estados`,
          estadosScoreAcima75Lista: data.estados_score_acima_75_lista?.join(', ') ?? 'Recomendados para expansão imediata',
          estadoMaiorScore: data.estado_maior_score,
          estadoMaiorDinamismo: data.estado_maior_dinamismo,
          estadoMenorDinamismo: data.estado_menor_dinamismo,
        },
        loading: false,
        error: null,
      }))
      .catch(err => setState({ data: null, loading: false, error: err.message }))
  }, [])

  return state
}
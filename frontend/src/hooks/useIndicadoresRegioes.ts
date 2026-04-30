import { useEffect, useState } from 'react'

const API_BASE = 'http://localhost:3000'

export interface IndicadorRegiao {
  regiao: string
  taxa_ativo_problematico: number
  taxa_inadimplencia: number
}

interface IndicadoresRegioesState {
  data: IndicadorRegiao[]
  loading: boolean
  error: string | null
}

const ORDEM_REGIOES = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul']

export function useIndicadoresRegioes(): IndicadoresRegioesState {
  const [state, setState] = useState<IndicadoresRegioesState>({
    data: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    fetch(`${API_BASE}/regioes/indicadores`)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar indicadores regionais')
        return res.json()
      })
      .then((data: IndicadorRegiao[]) => {
        const normalized = data.map(item => ({
          ...item,
          regiao: item.regiao?.toLowerCase() === 'note' ? 'Norte' : item.regiao,
        }))

        normalized.sort(
          (a, b) => ORDEM_REGIOES.indexOf(a.regiao) - ORDEM_REGIOES.indexOf(b.regiao)
        )

        setState({ data: normalized, loading: false, error: null })
      })
      .catch(err =>
        setState({ data: [], loading: false, error: err.message })
      )
  }, [])

  return state
}
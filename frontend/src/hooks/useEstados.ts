import { useEffect, useState } from 'react'

const API_BASE = 'http://localhost:3000'

export interface EstadoData {
  uf: string
  carteira_ativa: number
  taxa_crescimento: number
}

interface EstadosState {
  data: EstadoData[]
  loading: boolean
  error: string | null
}

export function useEstados(): EstadosState {
  const [state, setState] = useState<EstadosState>({
    data: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    fetch(`${API_BASE}/carteira-ativa/ranking`)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar estados')
        return res.json()
      })
      .then((data: EstadoData[]) =>
        setState({ data, loading: false, error: null })
      )
      .catch(err =>
        setState({ data: [], loading: false, error: err.message })
      )
  }, [])

  return state
}
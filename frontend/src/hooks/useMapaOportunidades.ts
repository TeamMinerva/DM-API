import { useEffect, useState } from 'react'
import type { OportunidadeEstado } from '../components/maps/MapaDeOportunidades'

const API_BASE = 'http://localhost:3000'

interface MapaOportunidadesState {
  data: OportunidadeEstado[]
  loading: boolean
  error: string | null
}

export function useMapaOportunidades(): MapaOportunidadesState {
  const [state, setState] = useState<MapaOportunidadesState>({
    data: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    fetch(`${API_BASE}/api/mapa/oportunidade`)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar dados do mapa de oportunidades')
        return res.json()
      })
      .then(data => {
        setState({
          data: Array.isArray(data) ? data : [],
          loading: false,
          error: null,
        })
      })
      .catch(err => {
        setState({
          data: [],
          loading: false,
          error: err.message,
        })
      })
  }, [])

  return state
}

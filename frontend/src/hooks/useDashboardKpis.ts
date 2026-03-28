import { useEffect, useState } from 'react'

const API_BASE = 'http://localhost:3000'

interface KpiData {
  carteiraTotal: string
  crescimentoCarteira: string
  inadimplencia: string
  totalOperacoes: string
  dataBase: string | null
}

interface KpiState {
  data: KpiData | null
  loading: boolean
  error: string | null
}

const formatCurrency = (value: number): string => {
  if (value >= 1_000_000_000_000) return `R$ ${(value / 1_000_000_000_000).toFixed(1)}T`
  if (value >= 1_000_000_000) return `R$ ${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(1)}K`
  return `R$ ${value.toFixed(2)}`
}

const formatOperacoes = (value: number): string => {
  if (value >= 1_000_000_000_000) return `${(value / 1_000_000_000_000).toFixed(1)}T`
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}mil`
  return `${value}`
}

export function useDashboardKpis(): KpiState {
  const [state, setState] = useState<KpiState>({
    data: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [kpisRes, crescimentoRes] = await Promise.all([
          fetch(`${API_BASE}/kpis`),
          fetch(`${API_BASE}/indicadores-nacionais/crescimento`),
        ])

        if (!kpisRes.ok || !crescimentoRes.ok) {
          throw new Error('Erro ao buscar dados da API')
        }

        const kpis = await kpisRes.json()
        const crescimento = await crescimentoRes.json()

        setState({
          data: {
            carteiraTotal: formatCurrency(kpis.carteira_ativa_total),
            crescimentoCarteira:
              crescimento.crescimento_carteira !== null
                ? `${crescimento.crescimento_carteira}%`
                : 'N/A',
            inadimplencia: `${kpis.inadimplencia_media}%`,
            totalOperacoes: formatOperacoes(kpis.total_operacoes),
            dataBase: kpis.data_base,
          },
          loading: false,
          error: null,
        })
      } catch (err) {
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Erro desconhecido',
        })
      }
    }

    fetchAll()
  }, [])

  return state
}
import { useEffect, useState } from "react";
import type { DadosOportunidade } from "../components/TabelaRanking";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export interface RankingEstado {
  uf: string;
  carteira_ativa: number;
  taxa_crescimento: number;
}

interface RankingScoreState {
  data: DadosOportunidade[];
  loading: boolean;
  error: string | null;
}

interface RankingState {
  data: RankingEstado[];
  loading: boolean;
  error: string | null;
}

export function useRankingEstados(): RankingState {
  const [state, setState] = useState<RankingState>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetch(`${API_BASE}/carteira-ativa/ranking?top=27`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar ranking");
        return res.json();
      })
      .then((data) =>
        setState({
          data,
          loading: false,
          error: null,
        })
      )
      .catch((err) =>
        setState({
          data: [],
          loading: false,
          error: err.message,
        })
      );
  }, []);

  return state;
}

export function useRankingScore(): RankingScoreState {
  const [state, setState] = useState<RankingScoreState>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetch(`${API_BASE}/api/ranking/score`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar ranking");
        return res.json();
      })
      .then((data) =>
        setState({
          data,
          loading: false,
          error: null,
        })
      )
      .catch((err) =>
        setState({
          data: [],
          loading: false,
          error: err.message,
        })
      );
  }, []);

  return state;
}
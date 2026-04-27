import { useEffect, useState } from "react";

const API_BASE = "http://localhost:3000";

export interface RankingEstado {
  uf: string;
  carteira_ativa: number;
  taxa_crescimento: number;
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
    fetch(`${API_BASE}/carteira-ativa/ranking?top=8`)
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
import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export interface CarteiraRegionalItem {
  label: string;
  pct: number;
  color: string;
}

interface CarteiraRegionalState {
  data: CarteiraRegionalItem[];
  loading: boolean;
  error: string | null;
}

const REGIOES = [
  { label: "Sudeste", color: "#1D1DD4" },
  { label: "Sul", color: "#7DF4ED" },
  { label: "Nordeste", color: "#FFE473" },
  { label: "Norte", color: "#68E699" },
  { label: "Centro-Oeste", color: "#FF928A" },
];

export function useCarteiraRegional(): CarteiraRegionalState {
  const [state, setState] = useState<CarteiraRegionalState>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetch(`${API_BASE}/regioes/carteira`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar participação regional");
        return res.json();
      })
      .then((data: Record<string, string | number>) => {
        const formatted = REGIOES.map((regiao) => ({
          ...regiao,
          pct: Number(data[regiao.label] ?? 0),
        }));

        setState({
          data: formatted,
          loading: false,
          error: null,
        });
      })
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

import { useEffect, useMemo, useState } from "react";
import type { DataItem } from "../components/maps/InadimplenciaHeatmap";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type TipoCliente = "PF" | "PJ";

interface HeatmapBackendItem {
  uf: string;
  porte: string;
  taxa_inadimplencia: number | null;
}

interface HeatmapState {
  data: DataItem[];
  loading: boolean;
  error: string | null;
}

export function useInadimplenciaHeatmap(tipo: TipoCliente): HeatmapState {
  const [state, setState] = useState<HeatmapState>({
    data: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    const fetchHeatmap = async () => {
      setState((current) => ({ ...current, loading: true, error: null }));

      try {
        const response = await fetch(
          `${API_BASE}/inadimplencia/heatmap?tipo=${tipo}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar heatmap de inadimplencia");
        }

        const payload: HeatmapBackendItem[] = await response.json();
        const data = payload.map((item) => ({
          uf: item.uf,
          porte: item.porte,
          taxa: item.taxa_inadimplencia,
          tipo,
        }));

        setState({ data, loading: false, error: null });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;

        setState({
          data: [],
          loading: false,
          error: err instanceof Error ? err.message : "Erro desconhecido",
        });
      }
    };

    fetchHeatmap();

    return () => controller.abort();
  }, [tipo]);

  return useMemo(() => state, [state]);
}

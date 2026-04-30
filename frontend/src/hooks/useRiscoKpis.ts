import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

interface BackendKpis {
  inadimplencia_media: number;
  data_base: string | null;
}

interface IndicadorRegional {
  regiao: string;
  taxa_ativo_problematico: number;
  taxa_inadimplencia: number;
}

interface RiscoKpisData {
  inadimplenciaMedia: string;
  ativoProblematico: string;
  regiaoCritica: string;
  regiaoCriticaTaxa: string;
  regiaoMenosCritica: string;
  regiaoMenosCriticaTaxa: string;
  dataBase: string | null;
}

interface RiscoKpisState {
  data: RiscoKpisData | null;
  loading: boolean;
  error: string | null;
}

const formatPercent = (value: number): string =>
  `${value.toFixed(1).replace(".", ",")}%`;

const formatPercentTwoDecimals = (value: number): string =>
  `${value.toFixed(2).replace(".", ",")}%`;

const normalizeRegionName = (regiao: string): string =>
  regiao.toLowerCase() === "note" ? "Norte" : regiao;

const getAverage = (values: number[]): number => {
  if (!values.length) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
};

export function useRiscoKpis(): RiscoKpisState {
  const [state, setState] = useState<RiscoKpisState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchRiscoKpis = async () => {
      try {
        const [kpisRes, regioesRes] = await Promise.all([
          fetch(`${API_BASE}/kpis`),
          fetch(`${API_BASE}/regioes/indicadores`),
        ]);

        if (!kpisRes.ok || !regioesRes.ok) {
          throw new Error("Erro ao buscar KPIs de risco");
        }

        const kpis: BackendKpis = await kpisRes.json();
        const regioes: IndicadorRegional[] = await regioesRes.json();
        const normalizedRegioes = regioes.map((item) => ({
          ...item,
          regiao: normalizeRegionName(item.regiao),
        }));

        const regiaoCritica = normalizedRegioes.reduce<IndicadorRegional | null>(
          (maior, atual) =>
            !maior || atual.taxa_inadimplencia > maior.taxa_inadimplencia
              ? atual
              : maior,
          null
        );

        const regiaoMenosCritica =
          normalizedRegioes.reduce<IndicadorRegional | null>(
            (menor, atual) =>
              !menor || atual.taxa_inadimplencia < menor.taxa_inadimplencia
                ? atual
                : menor,
            null
          );

        const ativoProblematicoMedio = getAverage(
          normalizedRegioes.map((item) => item.taxa_ativo_problematico)
        );

        setState({
          data: {
            inadimplenciaMedia: formatPercentTwoDecimals(
              kpis.inadimplencia_media || 0
            ),
            ativoProblematico: formatPercent(ativoProblematicoMedio),
            regiaoCritica: regiaoCritica?.regiao ?? "-",
            regiaoCriticaTaxa: regiaoCritica
              ? formatPercent(regiaoCritica.taxa_inadimplencia)
              : "0%",
            regiaoMenosCritica: regiaoMenosCritica?.regiao ?? "-",
            regiaoMenosCriticaTaxa: regiaoMenosCritica
              ? formatPercent(regiaoMenosCritica.taxa_inadimplencia)
              : "0%",
            dataBase: kpis.data_base,
          },
          loading: false,
          error: null,
        });
      } catch (err) {
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : "Erro desconhecido",
        });
      }
    };

    fetchRiscoKpis();
  }, []);

  return useMemo(() => state, [state]);
}
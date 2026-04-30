import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Tipagem dos dados
interface Indicador {
  regiao: string;
  taxa_ativo_problematico: number;
  taxa_inadimplencia: number;
}

const RegionalComparisonChart: React.FC = () => {
  const [data, setData] = useState<Indicador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/regioes/indicadores`);

        // 🔧 Corrige "Note" → "Norte"
        const normalized = response.data.map((item: Indicador) => ({
          ...item,
          regiao:
            item.regiao.toLowerCase() === "note"
              ? "Norte"
              : item.regiao,
        }));

        // 🔧 Ordem correta das regiões
        const order = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];
        normalized.sort(
          (a: Indicador, b: Indicador) =>
            order.indexOf(a.regiao) - order.indexOf(b.regiao)
        );

        setData(normalized);
      } catch (err) {
        setError("Erro ao carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="chart-loading">Carregando...</p>;
  if (error) return <p className="chart-error">{error}</p>;

  return (
    <div className="regional-chart">
      <div className="regional-chart__topbar" />

      <div className="regional-chart__header">
        <div>
          <h2 className="regional-chart__title">
            Inadimplência por Região
          </h2>
          <p className="regional-chart__subtitle">
            Inadimplência e ativo problemático
          </p>
        </div>

        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className="regional-chart__avatar"
        />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barGap={12}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical
            className="regional-chart__grid"
          />

          <XAxis
            dataKey="regiao"
            className="regional-chart__xaxis"
          />

          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            className="regional-chart__yaxis"
          />

          <Tooltip
            formatter={(value: number) => `${value}%`}
          />

          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="square"
          />

          <Bar
            dataKey="taxa_inadimplencia"
            name="Inadimplência"
            fill="#F3D46B"
            radius={[10, 10, 0, 0]}
          />

          <Bar
            dataKey="taxa_ativo_problematico"
            name="Ativo Problemático"
            fill="#F28B82"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RegionalComparisonChart;

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

interface Indicador {
  regiao: string;
  taxa_ativo_problematico: number;
  taxa_inadimplencia: number;
}

const chartContainerClass =
  "w-full bg-[#F1EFFF] rounded-[20px] p-6 font-[Catamaran]";

const RegionalComparisonChart: React.FC = () => {
  const [data, setData] = useState<Indicador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/regioes/indicadores`);

        const normalized = response.data.map((item: Indicador) => ({
          ...item,
          regiao: item.regiao.toLowerCase() === "note" ? "Norte" : item.regiao,
        }));

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

  if (loading) {
    return (
      <div
        className={chartContainerClass}
        style={{ borderTop: "5px solid #FF928A" }}
      >
        <p className="text-sm text-[#7B7E86]">Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={chartContainerClass}
        style={{ borderTop: "5px solid #FF928A" }}
      >
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div
      className={chartContainerClass}
      style={{ borderTop: "5px solid #FF928A" }}
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#7B7E86]">
          Inadimplencia por Regiao
        </h2>
        <p className="mt-1 text-sm font-semibold text-[#7B7E86]">
          Inadimplencia e ativo problematico
        </p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barGap={12}
            margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E2E2EA"
            />

            <XAxis
              dataKey="regiao"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#7B7E86" }}
            />

            <YAxis
              domain={[0, 10]}
              tickFormatter={(v) => `${v}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#7B7E86" }}
              width={34}
            />

            <Tooltip
              formatter={(value: number) => `${value}%`}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                fontSize: "13px",
              }}
            />

            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="square"
              iconSize={8}
              wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }}
            />

            <Bar
              dataKey="taxa_inadimplencia"
              name="Inadimplencia"
              fill="#FFE473"
              radius={[10, 10, 0, 0]}
            />

            <Bar
              dataKey="taxa_ativo_problematico"
              name="Ativo Problematico"
              fill="#FF928A"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RegionalComparisonChart;

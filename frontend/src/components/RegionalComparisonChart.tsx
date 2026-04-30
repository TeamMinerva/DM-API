import React from "react";
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
import { useIndicadoresRegioes } from "../hooks/useIndicadoresRegioes";

const RegionalComparisonChart: React.FC = () => {
  const { data, loading, error } = useIndicadoresRegioes();

  if (loading) {
    return (
      <div
        className="w-full bg-[#F1EFFF] rounded-[20px] p-6 font-[Catamaran]"
        style={{ borderTop: "5px solid #FFE473" }}
      >
        <p className="text-sm font-semibold text-[#7B7E86]">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="w-full bg-[#F1EFFF] rounded-[20px] p-6 font-[Catamaran]"
        style={{ borderTop: "5px solid #FFE473" }}
      >
        <p className="text-sm font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div
      className="w-full bg-[#F1EFFF] rounded-[20px] p-6 font-[Catamaran]"
      style={{ borderTop: "5px solid #FFE473" }}
    >
      {/* Cabeçalho */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#7B7E86]">
          Inadimplência por Região
        </h2>

        <p className="text-sm font-semibold text-[#7B7E86] mt-1">
          Inadimplência e ativo problemático
        </p>
      </div>

      {/* Gráfico */}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barGap={12}
            barCategoryGap="24%"
            margin={{ top: 10, right: 14, left: -15, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical
              stroke="#DCD9EF"
            />

            <XAxis
              dataKey="regiao"
              axisLine={{ stroke: "#7B7E86" }}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: "#6F717A",
              }}
            />

            <YAxis
              domain={[0, 10]}
              tickFormatter={(value) => `${value}`}
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: "#6F717A",
              }}
              width={40}
            />

            <Tooltip
              formatter={(value: number) => [`${value}%`, ""]}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                fontSize: "13px",
                color: "#7B7E86",
              }}
              cursor={{
                fill: "rgba(255, 255, 255, 0.25)",
              }}
            />

            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="square"
              iconSize={10}
              wrapperStyle={{
                fontSize: "13px",
                color: "#7B7E86",
                paddingTop: "12px",
              }}
            />

            <Bar
              dataKey="taxa_inadimplencia"
              name="Inadimplência"
              fill="#FFE473"
              radius={[24, 24, 0, 0]}
              maxBarSize={62}
            />

            <Bar
              dataKey="taxa_ativo_problematico"
              name="Ativo Problemático"
              fill="#FF8A84"
              radius={[24, 24, 0, 0]}
              maxBarSize={62}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RegionalComparisonChart;
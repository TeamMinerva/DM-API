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

// Tipagem dos dados da API
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
        const response = await axios.get("/indicadores");

        // 🔧 Normalização + correção "Note" → "Norte"
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

  if (loading) return <p style={{ padding: 20 }}>Carregando...</p>;
  if (error) return <p style={{ padding: 20 }}>{error}</p>;

  return (
    <div style={styles.container}>
      {/* Barra superior */}
      <div style={styles.topBar} />

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Inadimplência por Região</h2>
          <p style={styles.subtitle}>
            Inadimplência e ativo problemático
          </p>
        </div>

        {/* Avatar */}
        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          style={styles.avatar}
        />
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barGap={12}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#D9D4E7"
            vertical={true}
          />

          <XAxis
            dataKey="regiao"
            tick={{ fill: "#6B6B6B", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fill: "#6B6B6B", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            formatter={(value: number) => `${value}%`}
            contentStyle={{
              borderRadius: 8,
              border: "none",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          />

          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="square"
            wrapperStyle={{ paddingTop: 20, fontSize: 12 }}
          />

          {/* Amarelo */}
          <Bar
            dataKey="taxa_inadimplencia"
            name="Inadimplência"
            fill="#F3D46B"
            radius={[10, 10, 0, 0]}
          />

          {/* Coral */}
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

// 🎨 Estilos no mesmo arquivo
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "#F4F1FA",
    borderRadius: "18px",
    padding: "24px",
    position: "relative",
    boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
    width: "100%",
  },
  topBar: {
    height: "6px",
    backgroundColor: "#F3D46B",
    borderTopLeftRadius: "18px",
    borderTopRightRadius: "18px",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 600,
    color: "#2F2F2F",
  },
  subtitle: {
    margin: 0,
    fontSize: "13px",
    color: "#8A8A8A",
  },
  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    border: "2px solid white",
  },
};

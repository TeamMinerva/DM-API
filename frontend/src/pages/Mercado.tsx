import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import RankingEstadosCard from "../components/RankingEstadosCard";
import StateGrowthChart from "../components/StateGrowthChart";
import RegionalParticipationCard from "../components/RegionalParticipation";
import { useRankingEstados } from "../hooks/useRankingEstados";

export default function Mercado() {
  const { data, loading, error } = useRankingEstados();

  return (
    <div className="flex min-h-screen bg-[#FBFCF8]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="p-8 flex flex-col gap-6">

          <section>
            <h1 className="text-4xl text-[#1E1E1E]">
              Mercado de Crédito
            </h1>
            <p className="mt-4 text-[18px] text-[#7B7E86] font-medium">
              Crescimento e concentração da carteira ativa por estado
            </p>
          </section>

          {/* Gráfico de linha — largura total */}
          <div className="w-full">
            <StateGrowthChart />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          {/* Ranking + Participação Regional — lado a lado */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
            {loading ? (
              <div>Carregando...</div>
            ) : (
              <RankingEstadosCard estados={data} />
            )}
            <RegionalParticipationCard />
          </div>

        </main>
      </div>
    </div>
  );
}
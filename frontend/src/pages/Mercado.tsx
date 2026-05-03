import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import RankingEstadosCard from "../components/RankingEstadosCard";
import StateGrowthChart from "../components/StateGrowthChart";
import RegionalParticipationCard from "../components/RegionalParticipation";
import { useCarteiraRegional } from "../hooks/useCarteiraRegional";
import { useRankingEstados } from "../hooks/useRankingEstados";

export default function Mercado() {
  const [selectedUFs, setSelectedUFs] = useState<string[]>([]);
  const { data, loading, error } = useRankingEstados();
  const {
    data: regionalData,
    loading: regionalLoading,
    error: regionalError,
  } = useCarteiraRegional();

  return (
    <div className="flex h-screen bg-[#FBFCF8]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 p-8 flex flex-col gap-6 overflow-y-auto">

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
            <StateGrowthChart onSelectedUFsChange={setSelectedUFs} />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          {/* Ranking + Participação Regional — lado a lado */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.6fr)_minmax(320px,1fr)] gap-6">
            {loading ? (
              <div>Carregando...</div>
            ) : (
              <RankingEstadosCard estados={data} estadosDestaque={selectedUFs} />
            )}
            <RegionalParticipationCard
              data={regionalData}
              loading={regionalLoading}
              error={regionalError}
            />
          </div>

        </main>
      </div>
    </div>
  );
}

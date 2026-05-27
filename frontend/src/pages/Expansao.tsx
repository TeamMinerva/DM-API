import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import MapaOportunidadesCard from "../components/MapaOportunidadesCard";
import TabelaRanking from "../components/TabelaRanking";
import { useExpansaoKpis } from "../hooks/useExpansaoKpis";
import KpiCard from "../components/KpiCard";
import MethodologyCard from "../components/MethodologyCard";

export default function Expansao() {
  const { data, loading, error } = useExpansaoKpis();

  const kpis = {
    estadosScoreAcima75: data?.estadosScoreAcima75 ?? "–",
    estadosScoreAcima75Lista:
      data?.estadosScoreAcima75Lista ?? "Recomendados para expansão imediata",
    estadoMaiorScore: data?.estadoMaiorScore ?? "–",
    estadoMaiorDinamismo: data?.estadoMaiorDinamismo ?? "–",
    estadoMenorDinamismo: data?.estadoMenorDinamismo ?? "–",
  };

  return (
    <div className="flex h-screen bg-[#FBFCF8]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="p-8 flex-1 overflow-auto flex flex-col gap-6">
          {error && (
            <p className="text-red-500 text-sm">
              Erro ao carregar KPIs de expansão: {error}
            </p>
          )}

          {/* KPI Cards */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px] transition-all duration-300 ease-in-out ${loading ? "opacity-40" : "opacity-100"}`}
          >
            <KpiCard
              label="Alta Oportunidade"
              value={kpis.estadosScoreAcima75}
              borderColor="#68E699"
              footerText={kpis.estadosScoreAcima75Lista}
              footerColor="#68E699"
            />
            <KpiCard
              label="Melhor Score Geral"
              value={kpis.estadoMaiorScore}
              borderColor="#68E699"
              footerText="Maior índice de sustentabilidade"
            />
            <KpiCard
              label="Maior Crescimento"
              value={kpis.estadoMaiorDinamismo}
              borderColor="#202AD0"
              footerText="Maior dinamismo de carteira"
              footerColor="#68E699"
            />
            <KpiCard
              label="Menor Saturação"
              value={kpis.estadoMenorDinamismo}
              borderColor="#FFE473"
              footerText="Mercado menos explorado"
            />
          </div>

          {/* Mapa + Metodologia lado a lado */}
          <div className="flex flex-row gap-6 min-h-[480px]">
            <div className="flex-1 min-w-0">
              <MapaOportunidadesCard />
            </div>
            <div className="w-[340px] shrink-0">
              <MethodologyCard />
            </div>
          </div>

          {/* Tabela de Ranking */}
          <div className="w-full">
            <TabelaRanking />
          </div>
        </main>
      </div>
    </div>
  );
}
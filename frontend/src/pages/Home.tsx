  import Sidebar from "../components/Sidebar";
  import Topbar from "../components/Topbar";
  import KpiCard from "../components/KpiCard";
  import MapContainer from "../components/MapContainer";
  import InsightCard from "../components/InsightCard";
  import HighlightCard from "../components/HighlightCard";
  import { useDashboardKpis } from "../hooks/useDashboardKpis";

  export default function Home() {
    const { data, loading, error } = useDashboardKpis()

    const kpis = {
      carteiraTotal:    data?.carteiraTotal        ?? 'R$ 0',
      crescimento:      data?.crescimentoCarteira  ?? '0%',
      inadimplencia:    data?.inadimplencia        ?? '0%',
      totalOperacoes:   data?.totalOperacoes       ?? 0,
    }

    return (
      <div className="flex h-screen bg-[#FBFCF8]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <main className="p-8 flex-1 overflow-hidden">
            {error && (
              <p className="text-red-500 text-sm mb-2">
                Erro ao carregar KPIs: {error}
              </p>
            )}
            <div className="flex flex-col gap-2 h-full">
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px] -mt-8 transition-opacity duration-500 ${loading ? 'opacity-40' : 'opacity-100'}`}>
                <KpiCard
                  label="Carteira Total"
                  value={kpis.carteiraTotal}
                  borderColor="#FFE473"
                  footerText="Saldo ativo nacional"
                />
                <KpiCard
                  label="Crescimento da Carteira"
                  value={kpis.crescimento}
                  borderColor="#68E699"
                  footerText="Período completo"
                />
                <KpiCard
                  label="Inadimplência"
                  value={kpis.inadimplencia}
                  borderColor="#FF928A"
                  footerText="Média ponderada"
                />
                <KpiCard
                  label="Número de Operações"
                  value={kpis.totalOperacoes}
                  borderColor="#68E699"
                  footerText="Total acumulado"
                />
              </div>
              <div className="flex gap-[30px] items-stretch flex-1 mt-5">
                <div className="w-[60%]">
                  <MapContainer />
                </div>
                <div className="w-[40%] flex flex-col gap-4">
                  <InsightCard description="isso é um teste" />
                  <div className="grid grid-cols-2 gap-[30px]">
                    <HighlightCard
                      title="Estado Destaque"
                      stateAbbreviation="SP"
                      footerText="Maior Carteira Ativa"
                      accentColor="#2350DE"
                    />
                    <HighlightCard
                      title="Maior Crescimento"
                      stateAbbreviation="AM"
                      footerText="+18,4% a.a."
                      accentColor="#68E699"
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
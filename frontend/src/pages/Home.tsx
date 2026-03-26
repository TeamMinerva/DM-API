import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import KpiCard from "../components/KpiCard";
import MapContainer from "../components/MapContainer";
import InsightCard from "../components/InsightCard";
import HighlightCard from "../components/HighlightCard";

export default function Home() {
  return (
    <div className="flex h-screen bg-[#FBFCF8]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="p-8 flex-1 overflow-hidden">
          <div className="flex flex-col gap-2 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px] -mt-8">
              <KpiCard
                label="Carteira Total"
                value="R$ 1.5M"
                borderColor="#FFE473"
                footerText="Saldo ativo nacional"
              />
              <KpiCard
                label="Crescimento da Carteira"
                value="12%"
                borderColor="#68E699"
                footerText="Últimos 12 meses"
              />
              <KpiCard
                label="Inadimplência"
                value="3.8%"
                borderColor="#FF928A"
                footerText="-0,4pp vs 2024"
              />
              <KpiCard
                label="Número de Operações"
                value="28%"
                borderColor="#68E699"
                footerText="+12% vs 2024"
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

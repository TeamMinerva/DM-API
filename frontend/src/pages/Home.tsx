import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import KpiCard from "../components/KpiCard";
import MapContainer from "../components/MapContainer";
import InsightCard from "../components/InsightCard";
import HighlightCard from "../components/HighlightCard";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#e9e9e9]">
      <Sidebar />
      <div className="flex-1">
        <Topbar />

        <main className="p-8">
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              <KpiCard
                label="Volume de Concessões"
                value="R$ 1.5M"
                borderColor="#FFE473"
                footerText="+5% (mock)"
              />
              <KpiCard
                label="Crescimento da Carteira"
                value="12%"
                borderColor="#68E699"
                footerText="+2% (mock)"
              />
              <KpiCard
                label="Inadimplência"
                value="3.8%"
                borderColor="#FF928A"
                footerText="-0.5% (mock)"
              />
              <KpiCard
                label="Endividamento"
                value="28%"
                borderColor="#7DF4ED"
                footerText="Estável (mock)"
              />
            </div>

            <div className="flex gap-4 items-stretch">
              <div className="flex-[3]">
                <MapContainer />
              </div>

              <div className="flex-[2] flex flex-col gap-4">
                <InsightCard
                  title="teste de card"
                  description="isso é um teste"
                />
                <div className="grid grid-cols-2 gap-1">
                  <HighlightCard
                    title="teste"
                    stateAbbreviation="sp"
                    footerText="testando"
                    accentColor=""
                  />
                  <HighlightCard
                    title="teste"
                    stateAbbreviation="rj"
                    footerText="testando"
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

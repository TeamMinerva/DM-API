import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import MapaOportunidadesCard from "../components/MapaOportunidadesCard";
import TabelaRanking from "../components/TabelaRanking";

export default function Expansao() {
  return (
    <div className="flex h-screen bg-[#FBFCF8]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="p-8 flex-1 overflow-auto flex flex-col">
          <div className="w-full h-full min-h-[550px]">
            <MapaOportunidadesCard />
            <TabelaRanking />
          </div>
        </main>
      </div>
    </div>
  );
}

import BrazilMap from "../components/maps/BrazilMap"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import { KpiCard } from "../components/KpiCard"

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#e9e9e9]">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-8">
          {/* Trocamos a div simples por uma estrutura em coluna para acomodar os cards e o mapa */}
          <div className="flex flex-col gap-6">
            
            {/* Linha com os 4 KpiCards lado a lado no topo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KpiCard 
                title="Volume de Concessões" 
                value="R$ 1.5M" 
                topColor="amarelo" 
              />
              <KpiCard 
                title="Crescimento da Carteira" 
                value="+12%" 
                topColor="verde" 
              />
              <KpiCard 
                title="Inadimplência" 
                value="3.8%" 
                topColor="vermelho" 
              />
              <KpiCard 
                title="Endividamento" 
                value="28%" 
                topColor="teal" 
              />
            </div>

            {/* O mapa que a sua colega fez ocupando a parte de baixo */}
            <div className="w-full">
               <BrazilMap />
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
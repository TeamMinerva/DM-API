import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import KpiCard from "../components/KpiCard" // Note que aqui tiramos as chaves {}
import MapContainer from "../components/MapContainer" // Importando o MapContainer que ela criou

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#e9e9e9]">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-8">
          <div className="flex flex-col gap-6">
            
            {/* Linha com os 4 KpiCards ajustados para as novas props da sua amiga */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* O MapContainer oficial ocupando a parte de baixo */}
            <div className="w-full">
               <MapContainer />
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
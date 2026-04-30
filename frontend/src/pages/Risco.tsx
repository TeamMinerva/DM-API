import { useState } from 'react'
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import { InadimplenciaHeatmap } from "../components/maps/InadimplenciaHeatmap"
import RegionalComparisonChart from "../components/RegionalComparisonChart"

export default function Risco() {
  const [filtro, setFiltro] = useState<'PF' | 'PJ'>('PF')

  return (
    <div className="flex h-screen bg-[#FBFCF8]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 px-8 py-6 space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 gap-6">
            <div className="transition-all duration-300 ease-in-out">
              <RegionalComparisonChart />
            </div>
            <div className="transition-all duration-300 ease-in-out">
              <InadimplenciaHeatmap
                data={[]}
                filtro={filtro}
                onFiltroChange={setFiltro}
                loading={false}
                error={null}
                borderColor="#6EE7E7"
              />
            </div>
            
          </div>
        </main>
      </div>
    </div>
  )
}
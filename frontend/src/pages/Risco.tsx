import { useState } from 'react'
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import KpiCard from "../components/KpiCard"
import { InadimplenciaHeatmap } from "../components/maps/InadimplenciaHeatmap"
import RegionalComparisonChart from "../components/RegionalComparisonChart"
import { useRiscoKpis } from "../hooks/useRiscoKpis"

export default function Risco() {
  const [filtro, setFiltro] = useState<'PF' | 'PJ'>('PF')
  const { data, loading, error } = useRiscoKpis()

  const kpis = {
    inadimplenciaMedia: data?.inadimplenciaMedia ?? '0%',
    ativoProblematico: data?.ativoProblematico ?? '0%',
    regiaoCritica: data?.regiaoCritica ?? '-',
    regiaoCriticaTaxa: data?.regiaoCriticaTaxa ?? '0%',
    regiaoMenosCritica: data?.regiaoMenosCritica ?? '-',
    regiaoMenosCriticaTaxa: data?.regiaoMenosCriticaTaxa ?? '0%',
    dataBase: data?.dataBase ?? null,
  }

  return (
    <div className="flex h-screen bg-[#FBFCF8]">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 px-8 py-6 space-y-6 overflow-y-auto">
          {error && (
            <p className="text-red-500 text-sm">
              Erro ao carregar KPIs de risco: {error}
            </p>
          )}

          <div className="grid grid-cols-1 gap-6">
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[30px] transition-all duration-300 ease-in-out ${loading ? 'opacity-40' : 'opacity-100'}`}>
              <KpiCard
                label="Inadimplencia Media"
                value={kpis.inadimplenciaMedia}
                borderColor="#FFE473"
                footerText="Media ponderada"
              />

              <KpiCard
                label="Ativo Problematico"
                value={kpis.ativoProblematico}
                borderColor="#FF928A"
                footerText="Media das regioes"
              />

              <KpiCard
                label="Regiao Critica"
                value={kpis.regiaoCritica}
                borderColor="#FF928A"
                footerText={`${kpis.regiaoCriticaTaxa} de inadimplencia`}
                footerColor='#FF928A'
              />

              <KpiCard
                label="Regiao Menos Critica"
                value={kpis.regiaoMenosCritica}
                borderColor="#68E699"
                footerText={`${kpis.regiaoMenosCriticaTaxa} de inadimplencia`}
                footerColor="#68E699"
              />
            </div>

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
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import TabelaRanking from '../components/TabelaRanking';

export default function Expansao() {
  return (
    <div className="flex min-h-screen bg-white">
        <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="px-8 pb-8">
            {/* Espaço reservado para o mapa/gráfico superior que também segue o padrão de fundo do Figma */}
            <div className="h-[500px] rounded-2xl bg-[#F1EFFF] mb-8" />

            {/* A sua tabela de ranking */}
            <TabelaRanking />

        </main>
      </div>
    </div>
  )
}
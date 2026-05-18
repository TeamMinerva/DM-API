import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import MapaDeOportunidades, { OportunidadeEstado } from '../components/maps/MapaDeOportunidades';

export default function Expansao() {

  const dadosOportunidade: OportunidadeEstado[] = [
    { uf: 'SP', score_total: 92.5, categoria: 'Alta' },
    { uf: 'RJ', score_total: 78.0, categoria: 'Média-Alta' },
    { uf: 'MG', score_total: 65.4, categoria: 'Moderada' },
    { uf: 'BA', score_total: 42.1, categoria: 'Baixa' },
  ];
  return (
    <div className="flex h-screen bg-[#FBFCF8]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

          <div className="bg-white rounded-xl shadow p-6 h-[600px]">
            <h2 className="text-xl font-bold mb-4">Mapa de Oportunidades</h2>
            <div className="w-full h-full flex justify-center items-center">
              <MapaDeOportunidades dados={dadosOportunidade} />
            </div>
          </div>
        </div>
   </div>
      );
}
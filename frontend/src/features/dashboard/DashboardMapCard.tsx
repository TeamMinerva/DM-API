import BrazilMap from "../../components/maps/BrazilMap"

export default function DashboardMapCard() {
  return (
   
    <div className="rounded-3xl bg-[#F1EFFF] p-8  h-[550px] flex flex-col overflow-hidden w-full max-w-[600px]">
      <h2 className="text-xl font-bold mb-4 text-[#1e293b]">
        Distribuição da Carteira Ativa por Estado
      </h2>

      <div className="flex-1 flex items-end justify-start">
        
        <div className="w-[500px] h-[400px]"> 
          <BrazilMap />
        </div>
      </div>
    </div>
  )
}
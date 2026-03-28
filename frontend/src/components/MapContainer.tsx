import React from "react"
import BrazilMap from "../components/maps/BrazilMap"

const MapCard: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#F1EFFF] rounded-[20px] p-[30px] box-border flex flex-col gap-4 font-[Catamaran] relative overflow-hidden">
      <h3 className="text-xl font-semibold leading-none text-[#7B7E86] m-0">
        Distribuição da Carteira Ativa por Estado
      </h3>
      <div className="absolute top-[40px] left-[-40px] w-[110%] h-[85%] z-10 pointer-events-none">
        <BrazilMap />
      </div>
      <div className="flex-1" />
      <div className="flex flex-col gap-2 relative z-20">
        <div className="flex items-center gap-[10px] text-lg font-semibold text-[#7B7E86]">
          <div className="w-8 h-4 bg-[#202AD0] rounded-[4px]" />
          <span>Alta atividade</span>
        </div>
        <div className="flex items-center gap-[10px] text-lg font-semibold text-[#7B7E86]">
          <div className="w-8 h-4 bg-[#5A9BFF] rounded-[4px]" />
          <span>Alto crescimento</span>
        </div>
      </div>
    </div>
  )
}

export default MapCard
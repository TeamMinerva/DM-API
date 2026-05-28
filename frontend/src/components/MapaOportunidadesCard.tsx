import React from "react";
import { useMapaOportunidades } from "../hooks/useMapaOportunidades";
import MapaDeOportunidades from "./maps/MapaDeOportunidades";

export default function MapaOportunidadesCard() {
  const { data: dadosOportunidade, loading, error } = useMapaOportunidades();

  return (
    <div className="w-full h-full bg-[#F1EFFF] rounded-[20px] p-[30px] box-border flex flex-col gap-4 font-[Catamaran] relative overflow-hidden">
      <h3 className="text-xl font-semibold leading-none text-[#7B7E86] m-0">
        Mapa de Oportunidades
      </h3>

      <div className="absolute top-[40px] left-[-40px] w-[110%] h-[85%] z-10 pointer-events-auto">
        <MapaDeOportunidades dados={dadosOportunidade} />
      </div>

      {(loading || error) && (
        <div className="absolute top-[72px] right-[30px] z-20 text-sm font-semibold text-[#7B7E86]">
          {loading ? "Carregando dados..." : "Nao foi possivel carregar o mapa"}
        </div>
      )}

      <div className="flex-1" />

      <div className="flex flex-col gap-2 relative z-20 w-fit pointer-events-none">
        <div className="flex items-center gap-[10px] text-lg font-semibold text-[#7B7E86]">
          <div className="w-8 h-4 bg-[#202AD0] rounded-[4px]" />
          <span>Alta oportunidade</span>
        </div>
        <div className="flex items-center gap-[10px] text-lg font-semibold text-[#7B7E86]">
          <div className="w-8 h-4 bg-[#68E699] rounded-[4px]" />
          <span>Oportunidade media - alta</span>
        </div>
        <div className="flex items-center gap-[10px] text-lg font-semibold text-[#7B7E86]">
          <div className="w-8 h-4 bg-[#FFE473] rounded-[4px]" />
          <span>Oportunidade moderada</span>
        </div>
        <div className="flex items-center gap-[10px] text-lg font-semibold text-[#7B7E86]">
          <div className="w-8 h-4 bg-[#FF928A] rounded-[4px]" />
          <span>Baixa oportunidade</span>
        </div>
      </div>
    </div>
  );
}

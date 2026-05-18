import React from "react";
import MapaDeOportunidades, { OportunidadeEstado } from "./maps/MapaDeOportunidades";

export default function MapaOportunidadesCard() {
  // Dados fictícios 
  const dadosOportunidade: OportunidadeEstado[] = [
    { uf: 'SP', score_total: 92.5, categoria: 'Alta' },
    { uf: 'SC', score_total: 88.0, categoria: 'Alta' },
    { uf: 'PR', score_total: 85.0, categoria: 'Alta' },
    { uf: 'RS', score_total: 82.0, categoria: 'Alta' },
    { uf: 'DF', score_total: 89.0, categoria: 'Alta' },
    { uf: 'RJ', score_total: 78.0, categoria: 'Média-Alta' },
    { uf: 'MG', score_total: 75.0, categoria: 'Média-Alta' },
    { uf: 'MT', score_total: 72.0, categoria: 'Média-Alta' },
    { uf: 'GO', score_total: 70.0, categoria: 'Média-Alta' },
    { uf: 'MS', score_total: 68.0, categoria: 'Moderada' },
    { uf: 'ES', score_total: 65.4, categoria: 'Moderada' },
    { uf: 'BA', score_total: 60.0, categoria: 'Moderada' },
    { uf: 'PE', score_total: 58.0, categoria: 'Moderada' },
    { uf: 'CE', score_total: 55.0, categoria: 'Moderada' },
    { uf: 'RN', score_total: 52.0, categoria: 'Moderada' },
    { uf: 'PB', score_total: 50.0, categoria: 'Baixa' },
    { uf: 'AL', score_total: 48.0, categoria: 'Baixa' },
    { uf: 'SE', score_total: 45.0, categoria: 'Baixa' },
    { uf: 'PI', score_total: 42.0, categoria: 'Baixa' },
    { uf: 'MA', score_total: 40.0, categoria: 'Baixa' },
    { uf: 'PA', score_total: 38.0, categoria: 'Baixa' },
    { uf: 'AM', score_total: 35.0, categoria: 'Baixa' },
    { uf: 'RO', score_total: 32.0, categoria: 'Baixa' },
    { uf: 'TO', score_total: 30.0, categoria: 'Baixa' },
    { uf: 'AC', score_total: 28.0, categoria: 'Baixa' },
    { uf: 'AP', score_total: 25.0, categoria: 'Baixa' },
    { uf: 'RR', score_total: 22.0, categoria: 'Baixa' }
  ];

  return (
    <div className="w-full h-full bg-[#F1EFFF] rounded-[20px] p-[30px] box-border flex flex-col gap-4 font-[Catamaran] relative overflow-hidden">
      
      <h3 className="text-xl font-semibold leading-none text-[#7B7E86] m-0">
         Mapa de Oportunidades
      </h3>
      
      <div className="absolute top-[40px] left-[-40px] w-[110%] h-[85%] z-10 pointer-events-auto">
        <MapaDeOportunidades dados={dadosOportunidade} />
      </div>
      
      <div className="flex-1" />
      
      <div className="flex flex-col gap-2 relative z-20">
        <div className="flex items-center gap-[10px] text-lg font-semibold text-[#7B7E86]">
          <div className="w-8 h-4 bg-[#202AD0] rounded-[4px]" />
          <span>Alta oportunidade</span>
        </div>
        <div className="flex items-center gap-[10px] text-lg font-semibold text-[#7B7E86]">
          <div className="w-8 h-4 bg-[#68E699] rounded-[4px]" />
          <span>Oportunidade média - alta</span>
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
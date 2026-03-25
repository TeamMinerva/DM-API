import React from 'react';

const MapContainer: React.FC = () => {
  return (
    <div className="w-[569px] h-[497px] bg-[#F1EFFF] rounded-[20px] p-[30px] box-border flex flex-col justify-between relative font-[Catamaran]">
      <h3 className="text-xl font-semibold leading-none text-[#7B7E86] m-0">
        Distribuição da Carteira Ativa por Estado
      </h3>

      <div className="flex-1 flex items-center justify-center text-base font-semibold text-[#BBB]">
        [Mapa será exibido aqui]
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-[10px] text-lg font-semibold text-[#7B7E86]">
          <div className="w-8 h-4 bg-[#202AD0] rounded-[4px]" />
          <span>Alta atividade</span>
        </div>
        <div className="flex items-center gap-[10px] text-lg font-semibold text-[#7B7E86]">
          <div className="w-8 h-4 bg-[#7DF4ED] rounded-[4px]" />
          <span>Alto crescimento</span>
        </div>
      </div>
    </div>
  );
};

export default MapContainer;
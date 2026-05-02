import React from "react";
import type {RankingEstado}  from "../hooks/useRankingEstados";

interface Props {
  estados: RankingEstado[];
  borderColor?: string; 
}

const formatMoney = (valor: number) => {
  if (valor >= 1_000_000_000_000) {
    return `R$ ${(valor / 1_000_000_000_000).toFixed(1).replace(".", ",")}T`;
  }
  if (valor >= 1_000_000_000) {
    return `R$ ${(valor / 1_000_000_000).toFixed(1).replace(".", ",")}B`;
  }
  return `R$ ${valor.toFixed(0)}`;
};

const estadosNome: Record<string, string> = {
  SP: "São Paulo", RJ: "Rio de Janeiro", MG: "Minas Gerais",
  RS: "Rio Grande do Sul", SC: "Santa Catarina", CE: "Ceará",
  AC: "Acre", PA: "Pará", PR: "Paraná", GO: "Goiás", BA: "Bahia"
};

const getCrescimentoStyle = (taxa: number) => {
  if (taxa >= 9.0) return "bg-[#7DF4ED] text-white"; 
  if (taxa >= 7.0) return "bg-[#68E699] text-white"; 
  if (taxa >= 5.0) return "bg-[#FFE473] text-white"; 
  return "bg-[#FF928A] text-white"; 
};

const RankingEstadosCard: React.FC<Props> = ({ estados, borderColor = "#6EE7E7" }) => {
  const estadosDestaque = ["SP", "CE"];

  return (
    <div 
      className="w-full bg-[#F1EFFF] rounded-[28px] overflow-hidden flex flex-col p-5 sm:p-8 shadow-sm box-border font-[Catamaran]"
      style={{ borderTop: `6px solid ${borderColor}` }} 
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg sm:text-[20px] font-semibold text-[#7B7E86] flex gap-1.5 items-center flex-wrap">
          Ranking <span className="hidden sm:inline font-bold text-2xl leading-none -mt-1">·</span> 
          <span className="text-sm sm:text-lg">Estados com maior crédito ativo</span>
        </h2>
      </div>

      {/* Cabeçalho da tabela */}
      <div className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[1.5fr_1fr_1fr] pb-3 border-b border-[#E2E2EA] mb-5">
        <span className="text-sm sm:text-[18px] font-semibold text-[#7B7E86]">Estado</span>
        <span className="text-sm sm:text-[18px] font-semibold text-[#7B7E86] text-center">Carteira</span>
        <span className="text-sm sm:text-[18px] font-semibold text-[#7B7E86] text-right">Crescimento</span>
      </div>

      {/* Linhas */}
      <div
        className="
          flex max-h-[180px] flex-col gap-4 overflow-y-auto pr-1
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-[#D8D6F0]
          hover:[&::-webkit-scrollbar-thumb]:bg-[#BEBBE4]
          [scrollbar-width:thin]
          [scrollbar-color:#D8D6F0_transparent]
        "
      >
        {estados.map((estado, index) => {
          const isDestaque = estadosDestaque.includes(estado.uf);

          return (
            <div key={estado.uf} className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[1.5fr_1fr_1fr] items-center gap-1">
              {/* Coluna 1: Estado */}
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="text-[#8C8F99] font-medium text-xs sm:text-base w-3">{index + 1}</span>

                {/* Badge da UF */}
                <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border ${
                  isDestaque ? "bg-[#3354F4] text-white border-[#3354F4]" : "bg-transparent text-[#3354F4] border-[#3354F4]"
                }`}>
                  {estado.uf}
                </span>

               {/* Nome do Estado - Agora visível e ao lado */}
                <span className={`text-[13px] sm:text-[15px] truncate ${
                isDestaque ? "text-[#3354F4] font-bold" : "text-[#8C8F99] font-medium"
                 }`}>
                {estadosNome[estado.uf] || estado.uf}
               </span>
               
                <span className={`text-[13px] sm:text-[15px] truncate ${isDestaque ? "text-[#3354F4] font-bold" : "text-[#8C8F99] font-medium"}`}>
                  
                  <span className="hidden xs:inline">{estadosNome[estado.uf]}</span>
                </span>
              </div>

              {/* Coluna 2: Valor */}
              <span className="text-center font-bold text-[#1E1E1E] text-[13px] sm:text-[15px]">
                {formatMoney(estado.carteira_ativa)}
              </span>

              {/* Coluna 3: Badge */}
              <div className="flex justify-end">
                <span className={`px-2 py-1 rounded-full text-[11px] sm:text-[13px] font-bold ${getCrescimentoStyle(estado.taxa_crescimento)}`}>
                  +{estado.taxa_crescimento.toFixed(1).replace(".", ",")}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default RankingEstadosCard;

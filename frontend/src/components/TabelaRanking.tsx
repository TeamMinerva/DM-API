import { useState, useEffect } from 'react';

interface DadosOportunidade {
  estado: string;
  eficiencia: number;
  solidez: number;
  dinamismo: number;
  qualidade: number;
  score: number;
}

const TabelaRanking = () => {
  const [dados, setDados] = useState<DadosOportunidade[]>([
    { estado: 'SP', eficiencia: 150, solidez: 85, dinamismo: 15, qualidade: 90, score: 9.5 },
    { estado: 'MG', eficiencia: 120, solidez: 80, dinamismo: 12, qualidade: 88, score: 8.9 },
    { estado: 'SC', eficiencia: 90, solidez: 82, dinamismo: 10, qualidade: 85, score: 8.5 },
    { estado: 'PR', eficiencia: 80, solidez: 78, dinamismo: 8, qualidade: 80, score: 8.1 },
    { estado: 'RS', eficiencia: 70, solidez: 75, dinamismo: 5, qualidade: 70, score: 7.8 },
  ]);

  const todosDinamismos = dados.map(d => d.dinamismo);
  const todasQualidades = dados.map(d => d.qualidade);

  const getCorDinamismo = (valor: number) => {
    const max = Math.max(...todosDinamismos);
    const min = Math.min(...todosDinamismos);
    if (valor === max) return 'text-[#68E699]'; 
    if (valor === min) return 'text-[#FF928A]'; 
    return 'text-[#FFE473]';                    
  };

  const getCorQualidade = (valor: number) => {
    const top2 = [...todasQualidades].sort((a, b) => b - a).slice(0, 2);
    if (top2.includes(valor)) return 'text-[#68E699]'; 
    return 'text-[#FFE473]';                           
  };

  return (
    <div className="w-full bg-[#F1EFFF] rounded-2xl shadow-sm overflow-hidden font-[Catamaran]">
      {/* Faixa superior decorativa */}
      <div className="h-2 w-full bg-[#7DF4ED]"></div>

      <div className="p-6 sm:p-8">
        {/* Título */}
        <h2 className="text-xl sm:text-[22px] font-semibold text-[#7B7E86] mb-6 flex items-center gap-2">
          Ranking <span className="font-bold text-2xl leading-none mt-[-4px]">·</span> oportunidade de crédito sustentável
        </h2>
        
        <div className="overflow-x-auto pr-1">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#E2E2EA]">
                <th className="pb-3 px-2 text-[15px] font-semibold text-[#7B7E86]">Estado</th>
                <th className="pb-3 px-2 text-[15px] font-semibold text-[#7B7E86]">Eficiência</th>
                <th className="pb-3 px-2 text-[15px] font-semibold text-[#7B7E86]">Solidez</th>
                <th className="pb-3 px-2 text-[15px] font-semibold text-[#7B7E86]">Dinamismo</th>
                <th className="pb-3 px-2 text-[15px] font-semibold text-[#7B7E86]">Qualidade</th>
                <th className="pb-3 px-2 text-[15px] font-semibold text-[#7B7E86]">Score</th>
              </tr>
            </thead>
            <tbody>
              {dados.slice(0, 5).map((row, index) => (
                <tr 
                  key={row.estado} 
                  className="border-b border-[#E2E2EA]/60 hover:bg-black/5 transition-colors"
                >
                  <td className="py-4 px-2 flex items-center gap-4">
                    <span className="text-[#7B7E86] font-medium text-[15px] w-3">{index + 1}</span>
                    <span className="font-semibold text-[#7B7E86]">{row.estado}</span>
                  </td>
                  
                  <td className="py-4 px-2 font-semibold text-black">{row.eficiencia}K</td>
                  <td className="py-4 px-2 font-semibold text-black">{row.solidez}%</td>
                  
                  <td className={`py-4 px-2 font-extrabold ${getCorDinamismo(row.dinamismo)}`}>
                    {row.dinamismo}%
                  </td>
                  
                  <td className={`py-4 px-2 font-extrabold ${getCorQualidade(row.qualidade)}`}>
                    {row.qualidade}%
                  </td>
                  
                  <td className="py-4 px-2 font-bold text-black">{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TabelaRanking;
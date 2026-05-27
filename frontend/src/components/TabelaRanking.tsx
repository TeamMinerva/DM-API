import { useMemo } from 'react';
import { useRankingScore } from '../hooks/useRankingEstados';

export interface DadosOportunidade {
  dinamismo: number;
  eficiencia: number;
  qualidade: number;
  score: number;
  solidez: number;
  uf: string;
}

const UF_PARA_NOME: Record<string, string> = {
  AC: 'Acre',
  AL: 'Alagoas',
  AP: 'Amapá',
  AM: 'Amazonas',
  BA: 'Bahia',
  CE: 'Ceará',
  DF: 'Distrito Federal',
  ES: 'Espírito Santo',
  GO: 'Goiás',
  MA: 'Maranhão',
  MT: 'Mato Grosso',
  MS: 'Mato Grosso do Sul',
  MG: 'Minas Gerais',
  PA: 'Pará',
  PB: 'Paraíba',
  PR: 'Paraná',
  PE: 'Pernambuco',
  PI: 'Piauí',
  RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul',
  RO: 'Rondônia',
  RR: 'Roraima',
  SC: 'Santa Catarina',
  SP: 'São Paulo',
  SE: 'Sergipe',
  TO: 'Tocantins',
};

const TabelaRanking = () => {
  const { data: rankingData, loading } = useRankingScore();

  const dadosFiltrados = useMemo(() => {
    return rankingData ? [...rankingData] : [];
  }, [rankingData]);

  if (loading) return <p>Carregando...</p>;

  const todosDinamismos = dadosFiltrados.map(d => d.dinamismo);
  const todasQualidades = dadosFiltrados.map(d => d.qualidade);

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
    <div
      className="w-full bg-[#F1EFFF] rounded-[28px] shadow-sm overflow-hidden font-[Catamaran] p-6 sm:p-8 box-border"
      style={{ borderTop: '6px solid #7DF4ED' }}
    >
      {/* Título */}
      <h2 className="text-lg sm:text-[20px] font-semibold text-[#7B7E86] mb-6 flex items-center gap-1.5 flex-wrap">
        Ranking
        <span className="hidden sm:inline font-bold text-2xl leading-none -mt-1">·</span>
        <span className="text-sm sm:text-lg">oportunidade de crédito sustentável</span>
      </h2>

      {/* Scroll vertical limitado */}
      <div className="overflow-x-auto">
        <div
          className="
            max-h-[360px] overflow-y-auto pr-1
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-[#D8D6F0]
            hover:[&::-webkit-scrollbar-thumb]:bg-[#BEBBE4]
            [scrollbar-width:thin]
            [scrollbar-color:#D8D6F0_transparent]
          "
        >
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="sticky top-0 bg-[#F1EFFF] z-10">
                <tr className="border-b border-[#E2E2EA]">
                  <th className="pb-3 px-2 text-[15px] font-semibold text-[#7B7E86] text-left">
                    Estado
                  </th>
                  <th className="pb-3 px-2 text-[15px] font-semibold text-[#7B7E86] text-center">
                    Eficiência
                  </th>
                  <th className="pb-3 px-2 text-[15px] font-semibold text-[#7B7E86] text-center">
                    Solidez
                  </th>
                  <th className="pb-3 px-2 text-[15px] font-semibold text-[#7B7E86] text-center">
                    Dinamismo
                  </th>
                  <th className="pb-3 px-2 text-[15px] font-semibold text-[#7B7E86] text-center">
                    Qualidade
                  </th>
                  <th className="pb-3 px-2 text-[15px] font-semibold text-[#7B7E86] text-center">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {dadosFiltrados.map((row, index) => {
                  const isPrimeiro = index === 0;
                  const nomeEstado = UF_PARA_NOME[row.uf.toUpperCase()] ?? row.uf;

                  return (
                    <tr
                      key={row.uf}
                      className="border-b border-[#E2E2EA]/60 hover:bg-black/5 transition-colors"
                    >
                      <td className="py-4 px-2 flex items-center gap-4">
                        <span className="text-[#7B7E86] font-medium text-[15px] w-3">
                          {index + 1}
                        </span>
                        <span
                          className={`font-semibold ${
                            isPrimeiro ? 'text-[#1D1DD4]' : 'text-[#7B7E86]'
                          }`}
                        >
                          {nomeEstado}
                        </span>
                      </td>

                      <td className="py-4 px-2 font-semibold text-black text-center">
                        {(row.eficiencia / 1000).toLocaleString('pt-BR', {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        })}
                        K
                      </td>
                      <td className="py-4 px-2 font-semibold text-black text-center">
                        {row.solidez}%
                      </td>
                      <td
                        className={`py-4 px-2 font-extrabold text-center ${getCorDinamismo(row.dinamismo)}`}
                      >
                        {row.dinamismo}%
                      </td>
                      <td
                        className={`py-4 px-2 font-extrabold text-center ${getCorQualidade(row.qualidade)}`}
                      >
                        {row.qualidade}%
                      </td>
                      <td className="py-4 px-2 font-bold text-black text-center">
                        {row.score}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default TabelaRanking;
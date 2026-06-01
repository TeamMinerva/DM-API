import React from "react";

const MethodologyCard: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#1D1DD4] rounded-[20px] p-6 flex flex-col gap-5 box-border font-[Catamaran] overflow-hidden">
      <h3 className="text-xl font-semibold leading-none text-[#F1EFFF] m-0">
        Metodologia de Cálculo do Score
      </h3>

      {/* Container com rolagem vertical invisível */}
      <div
        className="
          flex-1 overflow-y-auto pr-1
          text-base font-medium leading-[140%]
          text-[#D8DEF3] text-justify
          flex flex-col gap-4
          [-ms-overflow-style:none]
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        <p className="m-0">
          O score é calculado a partir de quatro componentes derivados dos dados do SCR/BCB, combinados em um índice normalizado de 0 a 100.
        </p>

        <div className="flex flex-col gap-3">
          <p className="font-semibold m-0 text-[#F1EFFF]">
            Componentes base:
          </p>

          <ul className="list-none p-0 m-0 flex flex-col gap-3">
            <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#F1EFFF]">
              <strong className="text-[#F1EFFF] font-semibold">
                Qualidade da carteira (peso 35%)
              </strong>{" "}
              — razão entre o saldo adimplente e o total da carteira ativa,
              indicando a saúde do crédito em circulação no estado.
            </li>

            <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#F1EFFF]">
              <strong className="text-[#F1EFFF] font-semibold">
                Solidez dos ativos (peso 30%)
              </strong>{" "}
              — proporção da carteira que não apresenta risco de inadimplência
              futura, medida pelo inverso do ativo problemático relativo.
            </li>

            <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#F1EFFF]">
              <strong className="text-[#F1EFFF] font-semibold">
                Dinamismo (peso 25%)
              </strong>{" "}
              — taxa de crescimento percentual da carteira ativa entre períodos,
              capturando o ritmo de expansão do crédito local.
            </li>

            <li className="relative pl-5 before:content-['•'] before:absolute before:left-0 before:text-[#F1EFFF]">
              <strong className="text-[#F1EFFF] font-semibold">
                Eficiência operacional (peso 10%)
              </strong>{" "}
              — ticket médio por contrato (carteira ativa dividida pelo número
              de operações), indicando a maturidade e densidade do mercado.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MethodologyCard;

export interface DataItem {
  uf: string;
  porte: string;
  taxa: number | null;
  tipo: "PF" | "PJ";
}

interface Props {
  data: DataItem[];
  filtro: "PF" | "PJ";
  onFiltroChange: (filtro: "PF" | "PJ") => void;
  loading?: boolean;
  error?: string | null;
  borderColor?: string;
}

const UFS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

const PORTES_PF = [
  { label: "Sem rendimento", value: "Sem rendimento" },
  { label: "Até 1 SM", value: "Até 1 salário mínimo" },
  {
    label: "Mais de 1 a 2 SM",
    value: "Mais de 1 a 2 salários mínimos",
  },
  {
    label: "Mais de 2 a 3 SM",
    value: "Mais de 2 a 3 salários mínimos",
  },
  {
    label: "Mais de 3 a 5 SM",
    value: "Mais de 3 a 5 salários mínimos",
  },
  {
    label: "Mais de 5 a 10 SM",
    value: "Mais de 5 a 10 salários mínimos",
  },
  {
    label: "Mais de 10 a 20 SM",
    value: "Mais de 10 a 20 salários mínimos",
  },
  {
    label: "Acima de 20 SM",
    value: "Acima de 20 salários mínimos",
  },
];

const PORTES_PJ = [
  { label: "Micro", value: "Micro" },
  { label: "Pequeno", value: "Pequeno" },
  { label: "Médio", value: "Médio" },
  { label: "Grande", value: "Grande" },
];

const LEGEND_COLORS = [
  "#B3F0CB",
  "#68E699",
  "#FFF1B4",
  "#FFE473",
  "#FFBFBA",
  "#FF928A",
];

export const InadimplenciaHeatmap = ({
  data,
  filtro,
  onFiltroChange,
  loading,
  error,
  borderColor = "#6EE7E7",
}: Props) => {
  const portes = filtro === "PF" ? PORTES_PF : PORTES_PJ;

  const getCellStyle = (taxa: number | null | undefined): string => {
    if (taxa === undefined || taxa === null) return "bg-gray-100 text-gray-300";
    if (taxa <= 2.0) return "bg-[#B3F0CB] text-white";
    if (taxa <= 3.8) return "bg-[#68E699] text-white";
    if (taxa <= 5.8) return "bg-[#FFF1B4] text-white";
    if (taxa <= 7.8) return "bg-[#FFE473] text-white";
    if (taxa <= 10.0) return "bg-[#FFBFBA] text-white";
    return "bg-[#FF928A] text-white";
  };

  const getTaxaValue = (uf: string, porte: string): number | null | undefined =>
    data.find((d) => d.uf === uf && d.porte === porte && d.tipo === filtro)
      ?.taxa;

  return (
    <div
      className="bg-[#F1EFFF] p-6 rounded-[20px] w-full overflow-hidden"
      style={{ borderTop: `5px solid ${borderColor}` }}
    >
      <div className="flex justify-between items-start mb-8 gap-4">
        <div>
          <h3 className="text-[#7B7E86] font-semibold text-lg leading-snug">
            Mapa de Calor - Inadimplência
          </h3>
          <p className="text-[#7B7E86] text-sm mt-1">UF x Porte do Cliente</p>
        </div>

        <div className="flex bg-white p-1 rounded-full border border-gray-200 gap-1 shrink-0">
          {(["PF", "PJ"] as const).map((op) => (
            <button
              key={op}
              type="button"
              onClick={() => onFiltroChange(op)}
              className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all duration-150
                ${
                  filtro === op
                    ? "bg-[#2563EB] text-white shadow-sm"
                    : "text-[#2563EB] hover:bg-gray-100"
                }`}
            >
              {op}
            </button>
          ))}
        </div>
      </div>

      {error && !loading && (
        <div className="flex items-center justify-center h-40 text-sm text-red-400">
          {error}
        </div>
      )}

      {!error && (
        <div
          className="
            relative
            overflow-x-auto pb-3
            [&::-webkit-scrollbar]:h-2
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-[#D8D6F0]
            hover:[&::-webkit-scrollbar-thumb]:bg-[#BEBBE4]
            [scrollbar-width:thin]
            [scrollbar-color:#D8D6F0_transparent]
          "
        >
          <div className="min-w-[760px]">
            <div
              className="grid gap-3 mb-4"
              style={{
                gridTemplateColumns: `80px repeat(${portes.length}, minmax(120px, 1fr))`,
              }}
            >
              <div
                className="
                  sticky left-0 z-40
                  h-5
                  bg-[#F1EFFF]
                  shadow-[10px_0_0_#F1EFFF]
                "
              />

              {portes.map((porte) => (
                <div
                  key={porte.value}
                  className="
                    relative z-0
                    text-center text-[11px] font-semibold
                    text-gray-400 uppercase tracking-wider whitespace-nowrap
                  "
                >
                  {porte.label}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {UFS.map((uf) => (
                <div
                  key={uf}
                  className="grid gap-3 items-center"
                  style={{
                    gridTemplateColumns: `80px repeat(${portes.length}, minmax(120px, 1fr))`,
                  }}
                >
                  <div
                    className="
                      sticky left-0 z-40
                      h-11
                      flex items-center
                      bg-[#F1EFFF]
                      pr-3
                      text-[12px] font-medium text-gray-500 leading-tight whitespace-nowrap
                      shadow-[10px_0_0_#F1EFFF]
                    "
                  >
                    {uf}
                  </div>

                  {portes.map((porte) => {
                    const taxa = getTaxaValue(uf, porte.value);
                    const hasTaxa = taxa !== undefined && taxa !== null;

                    return (
                      <div
                        key={`${uf}-${porte.value}`}
                        title={
                          hasTaxa
                            ? `${uf} | ${porte.label}: ${taxa.toFixed(1)}%`
                            : `${uf} | ${porte.label}: sem dado`
                        }
                        className={`
                          relative z-0
                          h-11 rounded-xl flex items-center justify-center
                          font-bold text-[11px] transition-transform duration-100
                          hover:scale-105 cursor-default select-none whitespace-nowrap
                          ${getCellStyle(taxa)}
                        `}
                      >
                        {hasTaxa ? `${taxa.toFixed(1)}%` : ""}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {loading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center rounded-[20px] bg-[#F1EFFF]/70 text-sm text-gray-500">
              Carregando dados...
            </div>
          )}
        </div>
      )}

      {!error && (
        <div className="mt-8 flex items-center gap-3 text-xs font-semibold text-gray-400">
          <span>Baixo</span>

          <div className="flex gap-1.5">
            {LEGEND_COLORS.map((color) => (
              <div
                key={color}
                className="w-10 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <span>Alto</span>
        </div>
      )}
    </div>
  );
};

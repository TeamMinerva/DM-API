export interface DataItem {
    uf: string;
    porte: string;
    taxa: number;
    tipo: 'PF' | 'PJ';
}

interface Props {
    data: DataItem[];
    filtro: 'PF' | 'PJ';
    onFiltroChange: (filtro: 'PF' | 'PJ') => void;
    loading?: boolean;
    error?: string | null;
    borderColor?: string;
}

const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES'];

const PORTES = [
    'Sem rendimento',
    'Até 1 SM',
    'Mais de 1 a 2 SM',
    'Mais de 2 a 3 SM',
    'Mais de 3 a 5 SM',
    'Mais de 5 a 10 SM',
    'Mais de 10 a 20 SM',
    'Acima de 20 SM',
];

const LEGEND_COLORS = ['#B3F0CB', '#68E699', '#FFF1B4', '#FFE473', '#FFBFBA', '#FF928A'];

export const InadimplenciaHeatmap = ({ data, filtro, onFiltroChange, loading, error, borderColor = "#6EE7E7" }: Props) => {

    const getCellStyle = (taxa: number | undefined): string => {
        if (taxa === undefined) return 'bg-gray-100 text-gray-300';
        if (taxa <= 2.0) return 'bg-[#B3F0CB] text-white'; 
        if (taxa <= 3.8) return 'bg-[#68E699] text-white';
        if (taxa <= 5.8) return 'bg-[#FFF1B4] text-white';
        if (taxa <= 7.8) return 'bg-[#FFE473] text-white';
        if (taxa <= 10.0) return 'bg-[#FFBFBA] text-white';
        return 'bg-[#FF928A] text-white';                   
    };

    const getTaxaValue = (uf: string, porte: string): number | undefined =>
        data.find(d => d.uf === uf && d.porte === porte && d.tipo === filtro)?.taxa;

    return (
        <div
            className="bg-[#F1EFFF] p-6 rounded-3xl w-full overflow-hidden"
            style={{ borderTop: `6px solid ${borderColor}` }}
        >

            {/* ── Header ── */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-[#7B7E86] font-semibold text-lg leading-snug">
                        Mapa de Calor — Inadimplência
                    </h3>
                    <p className="text-[#7B7E86] text-sm mt-1">
                        UF × Porte do Cliente
                    </p>
                </div>

                {/* Toggle PF / PJ */}
                <div className="flex bg-white p-1 rounded-full border border-gray-200 gap-1">
                    {(['PF', 'PJ'] as const).map(op => (
                        <button
                            key={op}
                            onClick={() => onFiltroChange(op)}
                            className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all duration-150
                                ${filtro === op
                                    ? 'bg-[#2563EB] text-white shadow-sm'
                                    : 'text-[#2563EB] hover:bg-gray-100'
                                }`}
                        >
                            {op}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Loading ── */}
            {loading && (
                <div className="flex items-center justify-center h-40 text-sm text-gray-400">
                    Carregando dados...
                </div>
            )}

            {/* ── Erro ── */}
            {error && !loading && (
                <div className="flex items-center justify-center h-40 text-sm text-red-400">
                    {error}
                </div>
            )}

            {/* ── Matriz ── */}
            {!loading && !error && (
                <div className="overflow-x-auto">
                    <div className="min-w-[820px]">

                        {/* Cabeçalho — UFs */}
                        <div className="grid grid-cols-[180px_repeat(8,1fr)] gap-3 mb-4">
                            <div />
                            {UFS.map(uf => (
                                <div
                                    key={uf}
                                    className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
                                >
                                    {uf}
                                </div>
                            ))}
                        </div>

                        {/* Linhas — Portes */}
                        <div className="space-y-3">
                            {PORTES.map(porte => (
                                <div
                                    key={porte}
                                    className="grid grid-cols-[180px_repeat(8,1fr)] gap-3 items-center"
                                >
                                    <div className="text-[12px] font-medium text-gray-500 leading-tight">
                                        {porte}
                                    </div>

                                    {UFS.map(uf => {
                                        const taxa = getTaxaValue(uf, porte);
                                        return (
                                            <div
                                                key={`${uf}-${porte}`}
                                                title={
                                                    taxa !== undefined
                                                        ? `${uf} | ${porte}: ${taxa.toFixed(1)}%`
                                                        : `${uf} | ${porte}: sem dado`
                                                }
                                                className={`
                                                    h-11 rounded-xl flex items-center justify-center
                                                    font-bold text-[11px] transition-transform duration-100
                                                    hover:scale-105 cursor-default select-none
                                                    ${getCellStyle(taxa)}
                                                `}
                                            >
                                                {taxa !== undefined ? `+${taxa.toFixed(1)}%` : ''}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Legenda ── */}
            {!loading && !error && (
                <div className="mt-8 flex items-center gap-3 text-xs font-semibold text-gray-400">
                    <span>Baixo</span>
                    <div className="flex gap-1.5">
                        {LEGEND_COLORS.map(color => (
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
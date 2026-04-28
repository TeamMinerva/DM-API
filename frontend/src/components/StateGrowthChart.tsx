import { useState, useMemo } from 'react';
import axios from 'axios';
import Select from 'react-select';
import type { MultiValue } from 'react-select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// --- Interfaces ---
interface BackendEvolucao {
  data_base: string;
  uf: string;
  carteira_ativa: number;
}

interface PivotData {
  data_base: string;
  [key: string]: string | number;
}

interface Option {
  value: string;
  label: string;
}

type Status = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';

// --- Constantes ---
const api = axios.create({ baseURL: 'http://localhost:3000' });

const ESTADOS_OPCOES: Option[] = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
  'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
].map(uf => ({ value: uf, label: uf }));

const REGIAO_CORES: Record<string, string> = {
  // Nordeste
  AL: '#FFE473', BA: '#FFE473', CE: '#FFE473', MA: '#FFE473',
  PB: '#FFE473', PE: '#FFE473', PI: '#FFE473', RN: '#FFE473', SE: '#FFE473',
  // Norte
  AC: '#68E699', AM: '#68E699', AP: '#68E699',
  PA: '#68E699', RO: '#68E699', RR: '#68E699', TO: '#68E699',
  // Centro-Oeste
  DF: '#FF928A', GO: '#FF928A', MS: '#FF928A', MT: '#FF928A',
  // Sudeste
  ES: '#202AD0', MG: '#202AD0', RJ: '#202AD0', SP: '#202AD0',
  // Sul
  PR: '#7DF4ED', RS: '#7DF4ED', SC: '#7DF4ED',
};

// --- Formatação ---
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatYAxis = (value: number) =>
  `${(value / 1_000_000_000).toFixed(0)}`;

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr + '-02');
  return date.toLocaleDateString('pt-BR', { month: 'short' })
    .replace('.', '')
    .replace(/^\w/, c => c.toUpperCase());
};

const getPeriodTitle = (data: PivotData[]) => {
  if (data.length === 0) return '';
  const first = new Date(data[0].data_base + '-02');
  const last  = new Date(data[data.length - 1].data_base + '-02');
  const fmt = (d: Date) =>
    d.toLocaleDateString('pt-BR', { month: 'short' })
      .replace('.', '')
      .replace(/^\w/, c => c.toUpperCase());
  return `${fmt(first)} - ${fmt(last)} ${last.getFullYear()}`;
};

// --- Pivot ---
const pivotBackendData = (raw: BackendEvolucao[]): PivotData[] => {
  const grouped = raw.reduce<Record<string, PivotData>>((acc, curr) => {
    if (!acc[curr.data_base]) acc[curr.data_base] = { data_base: curr.data_base };
    acc[curr.data_base][curr.uf] = Number(curr.carteira_ativa);
    return acc;
  }, {});
  return Object.values(grouped).sort((a, b) => a.data_base.localeCompare(b.data_base));
};

// --- Componente ---
export default function StateGrowthChart() {
  const [selectedOptions, setSelectedOptions] = useState<MultiValue<Option>>([]);
  const [data, setData]     = useState<BackendEvolucao[]>([]);
  const [status, setStatus] = useState<Status>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');

  const chartData = useMemo(() => pivotBackendData(data), [data]);
  const activeUFs = useMemo(() => selectedOptions.map(o => o.value), [selectedOptions]);

  const fetchData = async (options: MultiValue<Option>) => {
    if (options.length < 2) return;
    setStatus('LOADING');
    setErrorMsg('');
    try {
      const ufs = options.map(o => o.value).join(',');
      const { data: resData } = await api.get<BackendEvolucao[]>(
        `/carteira-ativa/evolucao?estados=${ufs}`
      );
      setData(resData);
      setStatus('SUCCESS');
    } catch (err: unknown) {
      if (axios.isCancel(err)) return;
      setStatus('ERROR');
      setErrorMsg(
        (err as { response?: { data?: { error?: string } } })
          ?.response?.data?.error ?? 'Erro ao carregar dados do servidor.'
      );
    }
  };

  const handleSelectChange = (newValue: MultiValue<Option>) => {
    if (newValue.length > 3) return;
    setSelectedOptions(newValue);
    if (newValue.length >= 2) {
      fetchData(newValue);
    } else {
      setData([]);
      setStatus('IDLE');
    }
  };

  return (
    <div className="w-full bg-[#F1EFFF] rounded-[20px] p-6 font-[Catamaran]"
         style={{ borderTop: '5px solid #FFE473' }}>

      {/* Cabeçalho */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#7B7E86]">
          Crescimento da Carteira Ativa
        </h2>
        <div className="flex items-center gap-6 mt-1">
          <span className="text-sm font-semibold text-[#7B7E86]">
            {activeUFs.length >= 2 ? activeUFs.join(' vs ') : 'Selecione os estados'}
          </span>
          <span className="text-sm text-[#7B7E86]">
            {chartData.length > 0 ? getPeriodTitle(chartData) : ''}
          </span>
        </div>
      </div>

      {/* Select */}
      <div className="mb-5 max-w-xs">
        <Select
          isMulti
          options={ESTADOS_OPCOES}
          value={selectedOptions}
          onChange={handleSelectChange}
          isOptionDisabled={() => selectedOptions.length >= 3}
          placeholder="Selecione os estados..."
          noOptionsMessage={() => 'Limite de 3 estados atingido'}
          styles={{
            control: (base) => ({
              ...base,
              borderRadius: '12px',
              borderColor: '#E2E2EA',
              boxShadow: 'none',
              fontSize: '14px',
            }),
            multiValue: (base) => ({
              ...base,
              borderRadius: '8px',
              backgroundColor: '#E8E6FF',
            }),
          }}
        />
        {selectedOptions.length === 1 && (
          <p className="text-xs text-[#7B7E86] mt-1">
            Selecione pelo menos mais um estado.
          </p>
        )}
      </div>

      {/* Gráfico */}
      <div className="h-64">
        {status === 'LOADING' && (
          <p className="text-sm text-[#7B7E86]">Carregando dados...</p>
        )}
        {status === 'ERROR' && (
          <p className="text-sm text-red-500">{errorMsg}</p>
        )}
        {status === 'IDLE' && (
          <p className="text-sm text-[#7B7E86]">
            Aguardando seleção de estados para processar análise.
          </p>
        )}
        {status === 'SUCCESS' && chartData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E2EA" />
              <XAxis
                dataKey="data_base"
                tickFormatter={formatDateLabel}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#7B7E86' }}
              />
              <YAxis
                tickFormatter={formatYAxis}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#7B7E86' }}
                width={30}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), 'Carteira Ativa']}
                labelFormatter={(label) => `Período: ${label}`}
                contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '13px' }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '13px', paddingTop: '12px' }}
              />
              {activeUFs.map((uf) => (
                <Line
                  key={uf}
                  type="monotone"
                  dataKey={uf}
                  stroke={REGIAO_CORES[uf] ?? '#8884d8'}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name={uf}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
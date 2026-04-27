import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Select, { MultiValue } from 'react-select';
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

// --- Constantes e Auxiliares ---
const api = axios.create({ baseURL: 'http://localhost:3001' }); // Ajuste a porta se necessário

const ESTADOS_OPCOES: Option[] = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
].map(uf => ({ value: uf, label: uf }));

const COLORS: { [key: string]: string } = {
  SP: '#003366', RJ: '#D32F2F', MG: '#388E3C', PR: '#FBC02D',
  RS: '#7B1FA2', SC: '#E64A19', BA: '#0097A7', DEFAULT: '#8884d8'
};

// --- Funções de Formatação ---
const formatCurrency = (value: number) => 
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatYAxis = (value: number) => `R$ ${(value / 1_000_000_000).toFixed(1)} bi`;

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr + '-02'); // Adiciona dia para evitar timezone shift
  return date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
};

const getPeriodTitle = (data: PivotData[]) => {
  if (data.length === 0) return '';
  const first = new Date(data[0].data_base + '-02');
  const last = new Date(data[data.length - 1].data_base + '-02');
  const monthStart = first.toLocaleDateString('pt-BR', { month: 'short' });
  const monthEnd = last.toLocaleDateString('pt-BR', { month: 'short' });
  const year = last.getFullYear();
  return `${monthStart} - ${monthEnd} ${year}`;
};

// --- Função de Transformação (Pivot) ---
const pivotBackendData = (raw: BackendEvolucao[]): PivotData[] => {
  const grouped = raw.reduce((acc: { [key: string]: PivotData }, curr) => {
    if (!acc[curr.data_base]) {
      acc[curr.data_base] = { data_base: curr.data_base };
    }
    acc[curr.data_base][curr.uf] = Number(curr.carteira_ativa);
    return acc;
  }, {});

  return Object.values(grouped).sort((a, b) => 
    a.data_base.localeCompare(b.data_base)
  );
};

// --- Componente Principal ---
const StateGrowthChart: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<MultiValue<Option>>([]);
  const [data, setData] = useState<BackendEvolucao[]>([]);
  const [status, setStatus] = useState<Status>('IDLE');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const chartData = useMemo(() => pivotBackendData(data), [data]);
  const activeUFs = useMemo(() => selectedOptions.map(o => o.value), [selectedOptions]);

  const fetchData = async (options: MultiValue<Option>) => {
    if (options.length < 2) return;

    const controller = new AbortController();
    setStatus('LOADING');
    setErrorMsg('');

    try {
      const ufs = options.map(o => o.value).join(',');
      const params = new URLSearchParams({ estados: ufs });
      
      const response = await api.get<BackendEvolucao[]>(`/carteira-ativa/evolucao?${params}`, {
        signal: controller.signal
      });

      setData(response.data);
      setStatus('SUCCESS');
    } catch (err: any) {
      if (axios.isCancel(err)) return;
      setStatus('ERROR');
      setErrorMsg(err.response?.data?.error || 'Erro ao carregar dados do servidor.');
    }

    return () => controller.abort();
  };

  const handleSelectChange = (newValue: MultiValue<Option>) => {
    if (newValue.length > 3) return; // Trava UI
    setSelectedOptions(newValue);
    
    if (newValue.length >= 2) {
      fetchData(newValue);
    } else {
      setData([]);
      setStatus('IDLE');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Evolução da Carteira Ativa por Estado</h2>
      
      <div style={{ marginBottom: '25px', maxWidth: '500px' }}>
        <label>Selecione de 2 a 3 estados:</label>
        <Select
          isMulti
          options={ESTADOS_OPCOES}
          value={selectedOptions}
          onChange={handleSelectChange}
          isOptionDisabled={() => selectedOptions.length >= 3}
          placeholder="Selecione os estados..."
          noOptionsMessage={() => "Limite de 3 estados atingido"}
        />
        {selectedOptions.length === 1 && (
          <small style={{ color: '#666' }}>Selecione pelo menos mais um estado para ver o gráfico.</small>
        )}
      </div>

      <div style={{ height: '400px', background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
        {status === 'LOADING' && <p>Carregando dados...</p>}
        {status === 'ERROR' && <p style={{ color: 'red' }}>{errorMsg}</p>}
        
        {status === 'SUCCESS' && chartData.length > 0 && (
          <>
            <h3 style={{ textAlign: 'center', fontSize: '1.1rem' }}>
              {activeUFs.join(' vs ')} ({getPeriodTitle(chartData)})
            </h3>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="data_base" 
                  tickFormatter={formatDateLabel} 
                />
                <YAxis 
                  tickFormatter={formatYAxis} 
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), "Carteira Ativa"]}
                  labelFormatter={(label) => `Período: ${label}`}
                />
                <Legend />
                {activeUFs.map((uf) => (
                  <Line
                    key={uf}
                    type="monotone"
                    dataKey={uf}
                    stroke={COLORS[uf] || COLORS.DEFAULT}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name={uf}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
        
        {status === 'IDLE' && <p>Aguardando seleção de estados para processar análise.</p>}
      </div>
    </div>
  );
};

export default StateGrowthChart;

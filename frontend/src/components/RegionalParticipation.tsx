import React from 'react';

interface RegionData {
  label: string;
  pct: number;
  color: string;
}

const MOCK_DATA: RegionData[] = [
  { label: 'Sudeste',      pct: 58, color: '#1D1DD4' },
  { label: 'Sul',          pct: 16, color: '#7DF4ED' },
  { label: 'Nordeste',     pct: 12, color: '#FFE473' },
  { label: 'Norte',        pct:  9, color: '#68E699' },
  { label: 'Centro-Oeste', pct:  5, color: '#FF928A' },
];

interface RegionalParticipationCardProps {
  data?: RegionData[];
  loading?: boolean;
}

const RegionalParticipationCard: React.FC<RegionalParticipationCardProps> = ({
  data = MOCK_DATA,
  loading = false,
}) => {
  return (
    <div
      className={`w-full h-full bg-[#F1EFFF] rounded-[20px] p-6 font-[Catamaran] flex flex-col transition-opacity duration-500 ${loading ? 'opacity-40' : 'opacity-100'}`}
      style={{ borderTop: '5px solid #68E699' }}
    >
      <span className="block text-[17px] font-semibold leading-tight text-[#7B7E86]">
        Participação Regional na Carteira
      </span>

      <div className="mt-9 mb-8 flex h-11 w-full overflow-hidden rounded-full">
        {data.map((d) => (
          <div
            key={d.label}
            style={{ width: `${d.pct}%`, background: d.color }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {data.map((d) => (
          <div key={d.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-[5px] shrink-0"
                style={{ background: d.color }}
              />
              <span className="text-base font-semibold text-[#1E1E1E]">
                {d.label}
              </span>
            </div>
            <span className="text-base font-semibold text-[#7B7E86]">
              {d.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionalParticipationCard;

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
      className={`w-full bg-[#F1EFFF] rounded-[20px] p-5 font-[Catamaran] transition-opacity duration-500 ${loading ? 'opacity-40' : 'opacity-100'}`}
      style={{ borderTop: '5px solid #68E699' }}
    >
      <span className="block text-xl font-semibold text-[#7B7E86] mb-5 leading-tight">
        Participação Regional na Carteira
      </span>

      <div className="flex rounded-full overflow-hidden h-9 w-full mb-5">
        {data.map((d) => (
          <div
            key={d.label}
            style={{ width: `${d.pct}%`, background: d.color }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2.5">
        {data.map((d) => (
          <div key={d.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-4 h-4 rounded-[4px] shrink-0"
                style={{ background: d.color }}
              />
              <span className="text-[15px] font-semibold text-[#1E1E1E]">
                {d.label}
              </span>
            </div>
            <span className="text-[15px] font-semibold text-[#7B7E86]">
              {d.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionalParticipationCard;
import React from 'react';

interface KpiCardProps {
  label: string;
  value: string | number;
  footerText: string;
  borderColor: string;
}

const renderValue = (value: string | number) => {
  if (typeof value === 'number') {
    return <>{value.toLocaleString('pt-BR')}</>;
  }

  const match = value.match(/^(R)(\$)(.*)$/);
  if (match) {
    return (
      <>
        {match[1]}
        <span className="font-[Arial] text-[34px]">{match[2]}</span>
        {match[3]}
      </>
    );
  }

  return <>{value}</>;
};

const KpiCard: React.FC<KpiCardProps> = ({ label, value, footerText, borderColor }) => {
  return (
    <div
      className="w-[221px] h-[185px] bg-[#F1EFFF] rounded-[20px] flex flex-col p-6 box-border font-[Catamaran]"
      style={{ borderTop: `5px solid ${borderColor}` }}
    >
      <span className="text-xl font-semibold leading-none text-[#7B7E86] mb-3 block">
        {label}
      </span>
      <span className="text-[36px] font-semibold leading-none text-[#1E1E1E] mb-auto block">
        {renderValue(value)}
      </span>
      <span className="text-lg font-semibold leading-none text-[#7B7E86] block">
        {footerText}
      </span>
    </div>
  );
};

export default KpiCard;
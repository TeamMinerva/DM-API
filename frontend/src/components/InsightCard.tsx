import React from 'react';

interface InsightCardProps {
  title: string;
  description: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, description }) => {
  return (
    <div className="w-full h-full bg-[#1D1DD4] rounded-[20px] p-6 flex flex-col gap-5 box-border font-[Catamaran]">
      <h3 className="text-xl font-semibold leading-none text-[#F1EFFF] m-0">
        {title}
      </h3>
      <p className="text-lg font-semibold leading-[130%] text-[#D8DEF3] text-justify m-0">
        {description}
      </p>
    </div>
  );
};

export default InsightCard;
import React from 'react';

interface HighlightCardProps {
  title: string;
  stateAbbreviation: string;
  footerText: string;
  accentColor: string;
}

const HighlightCard: React.FC<HighlightCardProps> = ({ 
  title, 
  stateAbbreviation, 
  footerText, 
  accentColor 
}) => {
  return (
    <div className="w-full h-full bg-[#F1EFFF] rounded-[20px] p-5 flex flex-col justify-between font-[Catamaran]">
      <span className="text-xl font-semibold leading-none text-[#7B7E86]">
        {title}
      </span>
      <span className="text-[32px] font-semibold leading-none" style={{ color: accentColor }}>
        {stateAbbreviation}
      </span>
      <span className="text-base font-semibold leading-none" style={{ color: accentColor }}>
        {footerText}
      </span>
    </div>
  );
};

export default HighlightCard;
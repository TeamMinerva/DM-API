import React from 'react';

interface HighlightCardProps {
  title: string;
  stateAbbreviation: string;
  footerText: string;
  accentColor: string; // #2350DE para o primeiro, #68E699 para o segundo
}

const HighlightCard: React.FC<HighlightCardProps> = ({ 
  title, 
  stateAbbreviation, 
  footerText, 
  accentColor 
}) => {
  const textStyle: React.CSSProperties = {
    fontFamily: "'Catamaran', sans-serif",
    fontWeight: 600,
    lineHeight: '100%',
  };

  return (
    <div style={{
      width: '175px',
      height: '165px',
      backgroundColor: '#F1EFFF',
      borderRadius: '20px',
      padding: '20px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      opacity: 1
    }}>
      {/* Título */}
      <span style={{
        ...textStyle,
        fontSize: '20px',
        color: '#7B7E86',
      }}>
        {title}
      </span>

      {/* Sigla do Estado */}
      <span style={{
        ...textStyle,
        fontSize: '32px',
        color: accentColor,
      }}>
        {stateAbbreviation}
      </span>

      {/* Texto pequeno embaixo */}
      <span style={{
        ...textStyle,
        fontSize: '16px',
        color: accentColor,
      }}>
        {footerText}
      </span>
    </div>
  );
};

export default HighlightCard;

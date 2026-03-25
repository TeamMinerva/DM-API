import React from 'react';

interface InsightCardProps {
  title: string;
  description: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, description }) => {
  const containerStyle: React.CSSProperties = {
    width: '368px',
    height: '317px',
    backgroundColor: '#1D1DD4',
    borderRadius: '20px',
    padding: '24px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    fontFamily: "'Catamaran', sans-serif",
    opacity: 1
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: '100%',
    color: '#F1EFFF',
    margin: 0
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: '130%', // Ajuste leve para legibilidade no modo justify
    color: '#D8DEF3',
    textAlign: 'justify',
    margin: 0
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>{title}</h3>
      <p style={descriptionStyle}>{description}</p>
    </div>
  );
};

export default InsightCard;

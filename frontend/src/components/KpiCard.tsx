import React from 'react';

interface KpiCardProps {
  label: string;
  value: string | number; // Aceita string para casos como "6,2T" ou número para formatar
  footerText: string;
  borderColor: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, footerText, borderColor }) => {
  return (
    <div style={{ 
      width: '221px',
      height: '185px',
      backgroundColor: '#F1EFFF',
      borderRadius: '20px',
      borderTop: `5px solid ${borderColor}`,
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      boxSizing: 'border-box',
      fontFamily: "'Catamaran', sans-serif",
      opacity: 1
    }}>
      {/* Label (Título Principal) */}
      <span style={{
        fontSize: '20px',
        fontWeight: 600,
        lineHeight: '100%',
        color: '#7B7E86',
        marginBottom: '12px',
        display: 'block'
      }}>
        {label}
      </span>

      {/* Valor Principal (Números Grandes) */}
      <span style={{
        fontSize: '36px',
        fontWeight: 600,
        lineHeight: '100%',
        color: '#1E1E1E',
        marginBottom: 'auto',
        display: 'block'
      }}>
        {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
      </span>

      {/* Escrita da parte de baixo menor */}
      <span style={{
        fontSize: '18px',
        fontWeight: 600,
        lineHeight: '100%',
        color: '#7B7E86',
        display: 'block'
      }}>
        {footerText}
      </span>
    </div>
  );
};

export default KpiCard;

import React from 'react';

const MapContainer: React.FC = () => {
  const textStyle: React.CSSProperties = {
    fontFamily: "'Catamaran', sans-serif",
    fontWeight: 600,
    lineHeight: '100%',
    color: '#7B7E86',
  };

  const legendItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '18px',
    ...textStyle
  };

  const colorBlockStyle = (color: string): React.CSSProperties => ({
    width: '32px',
    height: '16px',
    backgroundColor: color,
    borderRadius: '4px'
  });

  return (
    <div style={{
      width: '569px',
      height: '497px',
      backgroundColor: '#F1EFFF',
      borderRadius: '20px',
      padding: '30px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative'
    }}>
      {/* Título do Container */}
      <h3 style={{ 
        fontSize: '20px', 
        margin: 0, 
        ...textStyle 
      }}>
        Distribuição da Carteira Ativa por Estado
      </h3>

      {/* Espaço do Mapa (Placeholder) */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        color: '#BBB',
        ...textStyle
      }}>
        [Mapa será exibido aqui]
      </div>

      {/* Legenda do Mapa */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={legendItemStyle}>
          <div style={colorBlockStyle('#202AD0')} />
          <span>Alta atividade</span>
        </div>
        <div style={legendItemStyle}>
          <div style={colorBlockStyle('#7DF4ED')} />
          <span>Alto crescimento</span>
        </div>
      </div>
    </div>
  );
};

export default MapContainer;

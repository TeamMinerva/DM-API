import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  topColor: string; 
}

export function KpiCard({ title, value, topColor }: KpiCardProps) {
  const cardStyle = {
    borderTop: `6px solid ${topColor}`,
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm" style={cardStyle}>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-semibold mt-1 text-gray-900">{value}</p>
    </div>
  );
}
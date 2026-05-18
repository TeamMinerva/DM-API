import React from 'react';
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import geoData from "./brazil-states.geo.json";

export interface OportunidadeEstado {
  uf: string;
  score_total: number;
  categoria: 'Alta' | 'Média-Alta' | 'Moderada' | 'Baixa';
}

const categoryColors: Record<string, string> = {
  'Alta': '#202AD0',      
  'Média-Alta': '#68E699', 
  'Moderada': '#FFE473',   
  'Baixa': '#FF928A',      
  'default': '#E5E7EB'    
};


const stateNameToUF: Record<string, string> = {
  Acre: "AC", Alagoas: "AL", Amapá: "AP", Amazonas: "AM", Bahia: "BA",
  Ceará: "CE", "Distrito Federal": "DF", "Espírito Santo": "ES", Goiás: "GO",
  Maranhão: "MA", "Mato Grosso": "MT", "Mato Grosso do Sul": "MS",
  "Minas Gerais": "MG", Pará: "PA", Paraíba: "PB", Paraná: "PR",
  Pernambuco: "PE", Piauí: "PI", "Rio de Janeiro": "RJ",
  "Rio Grande do Norte": "RN", "Rio Grande do Sul": "RS", Rondônia: "RO",
  Roraima: "RR", "Santa Catarina": "SC", "São Paulo": "SP",
  Sergipe: "SE", Tocantins: "TO",
};

interface MapaDeOportunidadesProps {
  dados: OportunidadeEstado[];
}
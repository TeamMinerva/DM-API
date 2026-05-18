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

export default function MapaDeOportunidades({ dados }: MapaDeOportunidadesProps) {

    const getColor = (uf: string) => {
        const estado = dados.find(e => e.uf === uf);
        if (!estado) return categoryColors.default;
        return categoryColors[estado.categoria] || categoryColors.default;
    };

    const onEachState = (feature: any, layer: any) => {
        const stateName = feature.properties.name;
        const uf = stateNameToUF[stateName];
        const estadoInfo = dados.find(e => e.uf === uf);
        const baseColor = getColor(uf);


        layer.setStyle({ fillColor: baseColor, weight: 0.75, color: "#FFF", fillOpacity: 1 });

        layer.on("mouseover", () => {
            layer.setStyle({ weight: 2.5, color: "#FFF", fillOpacity: 0.85, fillColor: baseColor });
            layer.bringToFront();
            const el = layer.getElement?.() ?? (layer as any)._path;
            if (el) {
                el.style.transform = "translateY(-4px)";
                el.style.transition = "transform 0.15s ease";
                el.style.filter = "drop-shadow(0 6px 8px rgba(0,0,0,0.3))";
            }
        });

        layer.on("mouseout", () => {
            layer.setStyle({ weight: 0.75, color: "#FFF", fillOpacity: 1, fillColor: baseColor });
            const el = layer.getElement?.() ?? (layer as any)._path;
            if (el) {
                el.style.transform = "translateY(0)";
                el.style.filter = "none";
            }
        });

        if (estadoInfo) {
            layer.bindTooltip(
                `<div style="text-align: center;">
          <strong>${stateName} (${uf})</strong><br/>
          Score Total: <strong>${estadoInfo.score_total.toFixed(2)}</strong><br/>
          Categoria: <strong>${estadoInfo.categoria}</strong>
        </div>`,
                { sticky: true, className: 'custom-leaflet-tooltip' }
            );
        } else {
            layer.bindTooltip(`<strong>${stateName} (${uf})</strong><br/>Sem dados`, { sticky: true });
        }
    };

    const mapKey = dados.length > 0 ? 'loaded-oportunidades' : 'empty-oportunidades';

    return (
        <div className="w-full h-full relative bg-transparent min-h-[400px]">
            <MapContainer
                key={mapKey}
                center={[-14, -47.5]} zoom={3.63} zoomSnap={0}
                scrollWheelZoom={false} dragging={false} doubleClickZoom={false}
                zoomControl={false} attributionControl={false}
                className="w-full h-full bg-transparent outline-none z-10"
                style={{ width: "100%", height: "100%", background: "transparent" }}
            >
                <GeoJSON
                    data={geoData as any}
                    style={{ weight: 1, opacity: 1, color: "white", fillOpacity: 1 }}
                    onEachFeature={onEachState}
                />
            </MapContainer>
        </div>
    );
}
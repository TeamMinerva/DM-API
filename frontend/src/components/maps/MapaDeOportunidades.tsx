import React from 'react';
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import geoData from "./brazil-states.geo.json";

export interface OportunidadeEstado {
    uf: string;
    score_total: number;
    categoria: 'Alta' | 'Media-Alta' | 'Moderada' | 'Baixa';
    ranking?: number;
}

const categoryColors: Record<string, string> = {
    'Alta': '#202AD0',
    'Media-Alta': '#68E699',
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

        layer.setStyle({ fillColor: baseColor, weight: 1, color: "#FFFFFF", fillOpacity: 1 });

        const resetEl = (el: HTMLElement) => {
            el.style.transform = "translateY(0)";
            el.style.filter = "none";
            el.style.transition = "transform 0.2s ease, filter 0.2s ease";
        };

        const elevateEl = (el: HTMLElement) => {
            el.style.transform = "translateY(-4px)";
            el.style.transition = "transform 0.2s ease, filter 0.2s ease";
            el.style.filter = "drop-shadow(0px 8px 12px rgba(0,0,0,0.2))";
        };

        layer.on("mouseover", () => {
            layer._map?.eachLayer((l: any) => {
                if (l !== layer) {
                    l.closeTooltip?.();
                    if (l._path) resetEl(l._path);
                    if (l.setStyle) l.setStyle({ weight: 1, fillOpacity: 1 });
                }
            });

            layer.setStyle({ weight: 3, color: "#FFFFFF", fillOpacity: 0.8, fillColor: baseColor });
            layer.bringToFront();

            const el = layer.getElement?.() ?? (layer as any)._path;
            if (el) elevateEl(el);
        });

        layer.on("mouseout", () => {
            layer.setStyle({ weight: 1, color: "#FFFFFF", fillOpacity: 1, fillColor: baseColor });
            const el = layer.getElement?.() ?? (layer as any)._path;
            if (el) resetEl(el);
        });

        if (estadoInfo) {
            layer.bindTooltip(
                `<div style="text-align: center; font-family: sans-serif;">
                    <strong style="font-size: 14px;">${stateName} (${uf})</strong><br/>
                    <div style="margin-top: 4px;">Score Total: <strong>${estadoInfo.score_total.toFixed(2)}</strong></div>
                    <div>Categoria: <strong style="color: ${baseColor}">${estadoInfo.categoria}</strong></div>
                </div>`,
                { sticky: true, className: 'custom-leaflet-tooltip' }
            );
        } else {
            layer.bindTooltip(`<strong>${stateName} (${uf})</strong><br/>Sem dados`, { sticky: true });
        }
    };

    const mapKey = dados.length > 0 ? 'loaded-oportunidades' : 'empty-oportunidades';

    return (
        <div className="w-full h-full relative bg-transparent">
            <MapContainer
                key={mapKey}
                // @ts-ignore
                center={[-14, -47.5]}
                zoom={3.63}
                zoomSnap={0}
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

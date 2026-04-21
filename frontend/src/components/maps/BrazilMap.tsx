import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import geoData from "./brazil-states.geo.json";
import type { EstadoData } from "../../hooks/useEstados";

type StateKey = "AC"|"AL"|"AP"|"AM"|"BA"|"CE"|"DF"|"ES"|"GO"|"MA"|"MT"|"MS"|"MG"|"PA"|"PB"|"PR"|"PE"|"PI"|"RJ"|"RN"|"RS"|"RO"|"RR"|"SC"|"SP"|"SE"|"TO";

const categoryColors = {
  high_activity: "#202AD0",
  high_growth: "#5A9BFF",
  default: "#E5E7EB",
};

const stateNameToUF: Record<string, StateKey> = {
  Acre: "AC", Alagoas: "AL", Amapá: "AP", Amazonas: "AM", Bahia: "BA",
  Ceará: "CE", "Distrito Federal": "DF", "Espírito Santo": "ES", Goiás: "GO",
  Maranhão: "MA", "Mato Grosso": "MT", "Mato Grosso do Sul": "MS",
  "Minas Gerais": "MG", Pará: "PA", Paraíba: "PB", Paraná: "PR",
  Pernambuco: "PE", Piauí: "PI", "Rio de Janeiro": "RJ",
  "Rio Grande do Norte": "RN", "Rio Grande do Sul": "RS", Rondônia: "RO",
  Roraima: "RR", "Santa Catarina": "SC", "São Paulo": "SP",
  Sergipe: "SE", Tocantins: "TO",
};

interface BrazilMapProps {
  estadosData: EstadoData[]
}

const formatCarteira = (value: number): string => {
  if (value >= 1_000_000_000_000) return `R$ ${(value / 1_000_000_000_000).toFixed(1)}T`
  if (value >= 1_000_000_000)     return `R$ ${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000)         return `R$ ${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000)             return `R$ ${(value / 1_000).toFixed(1)}K`
  return `R$ ${value.toFixed(0)}`
}

export default function BrazilMap({ estadosData }: BrazilMapProps) {
  const maxCarteira = Math.max(...estadosData.map(e => Number(e.carteira_ativa)), 0)
  const threshold = maxCarteira * 0.5

  const getColor = (uf: string) => {
    const estado = estadosData.find(e => e.uf === uf)
    if (!estado) return categoryColors.default
    return Number(estado.carteira_ativa) >= threshold
      ? categoryColors.high_activity
      : categoryColors.high_growth
  }

  const onEachState = (feature: any, layer: any) => {
    const stateName = feature.properties.name
    const uf = stateNameToUF[stateName]
    const estado = estadosData.find(e => e.uf === uf)
    const baseColor = getColor(uf)

    layer.setStyle({ fillColor: baseColor, weight: 0.75, color: "#FFF", fillOpacity: 1 })

    layer.on("mouseover", () => {
      layer.setStyle({ weight: 2.5, color: "#FFF", fillOpacity: 0.75, fillColor: baseColor })
      layer.bringToFront()
      const el = layer.getElement?.() ?? (layer as any)._path
      if (el) {
        el.style.transform = "translateY(-4px)"
        el.style.transition = "transform 0.15s ease"
        el.style.filter = "drop-shadow(0 6px 8px rgba(0,0,0,0.3))"
      }
    })

    layer.on("mouseout", () => {
      layer.setStyle({ weight: 0.75, color: "#FFF", fillOpacity: 1, fillColor: baseColor })
      const el = layer.getElement?.() ?? (layer as any)._path
      if (el) {
        el.style.transform = "translateY(0)"
        el.style.filter = "none"
      }
    })

    const carteiraFmt = estado ? formatCarteira(Number(estado.carteira_ativa)) : 'N/A'
    const crescFmt = estado
      ? `${estado.taxa_crescimento >= 0 ? '+' : ''}${estado.taxa_crescimento}%`
      : 'N/A'

    layer.bindTooltip(
      `<strong>${stateName} (${uf})</strong><br/>Carteira: ${carteiraFmt}<br/>Taxa de Crescimento: ${crescFmt}`,
      { sticky: true }
    )
  }

  const mapKey = estadosData.length > 0 ? 'loaded' : 'empty'

  return (
    <div className="w-full h-full relative bg-transparent">
      <MapContainer
        key={mapKey}
        // @ts-ignore
        center={[-14, -47.5]} zoom={3.63} zoomSnap={0}
        scrollWheelZoom={false} dragging={false} doubleClickZoom={false}
        zoomControl={false} attributionControl={false}
        className="w-full h-full bg-transparent outline-none z-10"
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <GeoJSON
          data={geoData}
          // @ts-ignore 
          style={{ weight: 1, opacity: 1, color: "white", fillOpacity: 1 }}
          onEachFeature={onEachState}
        />
      </MapContainer>
    </div>
  )
}
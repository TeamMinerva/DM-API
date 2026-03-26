import { MapContainer, GeoJSON } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import geoData from "./brazil-states.geo.json"
import { useMemo } from "react"


type StateKey =
  | "AC" | "AL" | "AP" | "AM" | "BA" | "CE" | "DF"
  | "ES" | "GO" | "MA" | "MT" | "MS" | "MG" | "PA"
  | "PB" | "PR" | "PE" | "PI" | "RJ" | "RN" | "RS"
  | "RO" | "RR" | "SC" | "SP" | "SE" | "TO"

type Category = "high_activity" | "high_growth"

const categoryColors = {
  high_activity: "#202AD0", 
  high_growth: "#7DF4ED",   
  default: "#E5E7EB"
}

const stateNameToUF: Record<string, StateKey> = {
  Acre: "AC", Alagoas: "AL", Amapá: "AP", Amazonas: "AM", Bahia: "BA",
  Ceará: "CE", "Distrito Federal": "DF", "Espírito Santo": "ES", Goiás: "GO",
  Maranhão: "MA", "Mato Grosso": "MT", "Mato Grosso do Sul": "MS",
  "Minas Gerais": "MG", Pará: "PA", Paraíba: "PB", Paraná: "PR",
  Pernambuco: "PE", Piauí: "PI", "Rio de Janeiro": "RJ",
  "Rio Grande do Norte": "RN", "Rio Grande do Sul": "RS",
  Rondônia: "RO", Roraima: "RR", "Santa Catarina": "SC",
  "São Paulo": "SP", Sergipe: "SE", Tocantins: "TO"
}


function MapLegend() {
  return (
    <div className="absolute bottom-2 left-2 z-[1000] flex flex-col gap-2 bg-white/80 p-2 rounded-lg backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-2 rounded-full" style={{ backgroundColor: categoryColors.high_activity }} />
        <span className="text-xs text-slate-600 font-medium">Alta atividade</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-2 rounded-full" style={{ backgroundColor: categoryColors.high_growth }} />
        <span className="text-xs text-slate-600 font-medium">Alto crescimento</span>
      </div>
    </div>
  )
}

export default function BrazilMap() {
  const mockData = useMemo(() => {
    const data: Record<string, { category: Category; value: number }> = {}
    Object.values(stateNameToUF).forEach((uf) => {
      data[uf] = {
        category: Math.random() > 0.5 ? "high_activity" : "high_growth",
        value: Math.floor(Math.random() * 1_000_000_000)
      }
    })
    return data
  }, [])

  const getColor = (uf: string) => {
    const data = mockData[uf]
    return data ? categoryColors[data.category] : categoryColors.default
  }

  const onEachState = (feature: any, layer: any) => {
    const stateName = feature.properties.name
    const uf = stateNameToUF[stateName]
    const data = mockData[uf]

    layer.setStyle({
      fillColor: getColor(uf),
      weight: 1,
      color: "#FFFFFF",
      fillOpacity: 1
    })

    layer.bindTooltip(
      `<strong>${stateName} (${uf})</strong><br/>`,
      { sticky: true }
    )
  }

  return (
    <div className="W-full h-[450px] relative bg-transparent">
      <MapContainer
        center={[-15.75, -48.0]}
        zoom={3} 
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full bg-transparent outline-none z-10"
        style={{ width: "45%", height: "100%", background: "transparent" }}
      >
        <GeoJSON
          data={geoData}
          style={{
            weight: 1,
            opacity: 1,
            color: 'white',      
            fillOpacity: 0.8
          }}
          onEachFeature={onEachState}
        />

      </MapContainer>

      <MapLegend />
    </div>
  )
}
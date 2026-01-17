import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import { RiskBadge } from "./RiskBadge";
import type { FloodRecord } from "@shared/schema";

// Helper to update map center when selected city changes
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface MapComponentProps {
  data: FloodRecord[];
  selectedCity?: string;
}

const CITY_COORDINATES: Record<string, [number, number]> = {
  "Quezon City": [14.6760, 121.0437],
  "Manila": [14.5995, 120.9842],
  "Marikina": [14.6507, 121.0984],
  "Pasig": [14.5764, 121.0851],
  "Metro Manila": [14.5995, 121.03] // Default generic center
};

export function MapComponent({ data, selectedCity }: MapComponentProps) {
  const center = selectedCity && CITY_COORDINATES[selectedCity] 
    ? CITY_COORDINATES[selectedCity] 
    : CITY_COORDINATES["Metro Manila"];
    
  const zoom = selectedCity ? 13 : 11;

  const getMarkerColor = (level: number) => {
    if (level >= 8) return "#ef4444"; // red-500
    if (level >= 5) return "#f97316"; // orange-500
    if (level >= 3) return "#eab308"; // yellow-500
    return "#10b981"; // emerald-500
  };

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-inner border border-border/50 bg-slate-100 relative z-0">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <MapController center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data.map((point) => (
          <CircleMarker
            key={point.id}
            center={[point.latitude, point.longitude]}
            radius={8 + (point.floodHeight * 2)} // Larger radius for higher flood
            pathOptions={{
              color: getMarkerColor(point.floodHeight),
              fillColor: getMarkerColor(point.floodHeight),
              fillOpacity: 0.6,
              weight: 2
            }}
          >
            <Popup className="font-sans">
              <div className="p-1 min-w-[150px]">
                <h4 className="font-bold text-sm mb-1 font-display">{point.city}</h4>
                <RiskBadge level={point.floodHeight} className="mb-2" />
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>Rainfall: <span className="text-foreground font-medium">{point.precipitation}mm</span></p>
                  <p>Elevation: <span className="text-foreground font-medium">{point.elevation}m</span></p>
                  <p>Type: <span className="text-foreground font-medium">{point.isPrediction ? "Prediction" : "Live Data"}</span></p>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

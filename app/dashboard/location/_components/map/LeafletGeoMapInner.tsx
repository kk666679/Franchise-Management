"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { DEFAULT_CENTER, DEFAULT_ZOOM, TILE_LAYERS, type TileLayerKey } from "../../_lib/map-config";
import { createColoredIcon } from "../../_lib/leaflet-icons";
import { LOCATION_TYPE_COLORS, LOCATION_TYPE_LABELS, type FranchiseLocationType } from "../../_lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type GeoLocationRecord = {
  id: string;
  name: string;
  code: string;
  locationType: FranchiseLocationType;
  status: string;
  businessStatus?: string | null;
  latitude: number | null;
  longitude: number | null;
  addressLine1?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  brand?: { id: string; name: string } | null;
  franchisee?: { id: string; legalName: string; tradingName: string | null } | null;
  assignedTerritory?: { id: string; name: string; territoryCode: string } | null;
};

export type GeoTerritoryRecord = {
  id: string;
  name: string;
  territoryCode: string;
  territoryType: string;
  status: string;
  geometry: any;
  areaSqKm?: number | null;
};

type Props = {
  locations: GeoLocationRecord[];
  territories?: GeoTerritoryRecord[];
  selectedLocationId?: string | null;
  onSelectLocation?: (id: string) => void;
  onMapClick?: (lat: number, lng: number) => void;
  drawMode?: "none" | "point" | "polygon";
  onDrawComplete?: (geometry: any) => void;
  height?: string;
  showLayerControl?: boolean;
};

function MapEvents({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) { onMapClick?.(e.latlng.lat, e.latlng.lng); },
  });
  return null;
}

function InvalidateSize() {
  const map = useMap();
  useEffect(() => { setTimeout(() => map.invalidateSize(), 0); }, [map]);
  return null;
}

function DrawController({ mode, onDrawComplete }: { mode: "none" | "point" | "polygon"; onDrawComplete?: (g: any) => void }) {
  const map = useMap();
  const polygonPoints = useRef<[number, number][]>([]);
  const tempLayer = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (mode !== "polygon") {
      polygonPoints.current = [];
      if (tempLayer.current) { tempLayer.current.remove(); tempLayer.current = null; }
    }
  }, [mode]);

  useMapEvents({
    click(e) {
      if (mode === "point") {
        onDrawComplete?.({ type: "Point", coordinates: [e.latlng.lng, e.latlng.lat] });
      } else if (mode === "polygon") {
        polygonPoints.current.push([e.latlng.lat, e.latlng.lng]);
        if (tempLayer.current) tempLayer.current.remove();
        tempLayer.current = L.polyline(polygonPoints.current, { color: "#2563eb", dashArray: "6 4" }).addTo(map);
      }
      if (mode === "polygon" && (e.originalEvent as MouseEvent).detail === 2 && polygonPoints.current.length >= 3) {
        const ring = polygonPoints.current.map(([lat, lng]) => [lng, lat] as [number, number]);
        ring.push(ring[0]);
        polygonPoints.current = [];
        if (tempLayer.current) { tempLayer.current.remove(); tempLayer.current = null; }
        onDrawComplete?.({ type: "Polygon", coordinates: [ring] });
      }
    },
  });
  return null;
}

export function LeafletGeoMapInner({
  locations, territories = [], selectedLocationId, onSelectLocation, onMapClick, drawMode = "none", onDrawComplete, height = "600px", showLayerControl = true,
}: Props) {
  const [baseLayer, setBaseLayer] = useState<TileLayerKey>("osm");
  const [showLocations, setShowLocations] = useState(true);
  const [showTerritories, setShowTerritories] = useState(true);

  const validLocations = useMemo(() => locations.filter((l) => l.latitude != null && l.longitude != null), [locations]);
  const center = useMemo<[number, number]>(() => {
    if (selectedLocationId) {
      const sel = validLocations.find((l) => l.id === selectedLocationId);
      if (sel) return [Number(sel.latitude), Number(sel.longitude)];
    }
    if (validLocations.length) return [Number(validLocations[0].latitude), Number(validLocations[0].longitude)];
    return DEFAULT_CENTER;
  }, [validLocations, selectedLocationId]);

  const icons = useMemo(() => {
    const m = new Map<string, L.Icon>();
    for (const t of Object.keys(LOCATION_TYPE_COLORS) as FranchiseLocationType[]) m.set(t, createColoredIcon(LOCATION_TYPE_COLORS[t]));
    return m;
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card" style={{ height }}>
      {showLayerControl && (
        <div className="absolute right-3 top-3 z-[1000] flex flex-col gap-2 rounded-xl border border-border bg-background/95 p-2 shadow-lg backdrop-blur">
          <div className="text-xs font-medium text-muted-foreground">Basemap</div>
          <div className="flex flex-wrap gap-1">
            {(Object.keys(TILE_LAYERS) as TileLayerKey[]).map((k) => (
              <Button key={k} size="xs" variant={baseLayer === k ? "default" : "outline"} onClick={() => setBaseLayer(k)}>{TILE_LAYERS[k].name}</Button>
            ))}
          </div>
          <div className="mt-1 text-xs font-medium text-muted-foreground">Layers</div>
          <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={showLocations} onChange={(e) => setShowLocations(e.target.checked)} /> Locations</label>
          <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={showTerritories} onChange={(e) => setShowTerritories(e.target.checked)} /> Territories</label>
        </div>
      )}
      <MapContainer center={center} zoom={DEFAULT_ZOOM} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <InvalidateSize />
        <TileLayer attribution={TILE_LAYERS[baseLayer].attribution} url={TILE_LAYERS[baseLayer].url} />
        <MapEvents onMapClick={onMapClick} />
        <DrawController mode={drawMode} onDrawComplete={onDrawComplete} />

        {showTerritories && territories.map((t) => {
          if (!t.geometry) return null;
          const coords = t.geometry.type === "Polygon"
            ? t.geometry.coordinates.map((ring: any[]) => ring.map(([lng, lat]: [number, number]) => [lat, lng]))
            : t.geometry.coordinates.flat(1).map((ring: any[]) => ring.map(([lng, lat]: [number, number]) => [lat, lng]));
          const polygons = t.geometry.type === "Polygon" ? [coords] : coords;
          return polygons.map((rings: any, i: number) => (
            <Polygon key={`${t.id}-${i}`} positions={rings} pathOptions={{ color: t.territoryType === "EXCLUSIVE" ? "#dc2626" : "#2563eb", weight: 2, fillOpacity: 0.12 }}>
              <Popup>
                <div className="space-y-1 text-sm">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-muted-foreground">{t.territoryCode}</div>
                  <div>{t.territoryType} · {t.status}</div>
                  {t.areaSqKm != null && <div>{t.areaSqKm.toFixed(2)} km²</div>}
                </div>
              </Popup>
            </Polygon>
          ));
        })}

        {showLocations && (
          <MarkerClusterGroup chunkedLoading>
            {validLocations.map((loc) => (
              <Marker
                key={loc.id}
                position={[Number(loc.latitude), Number(loc.longitude)]}
                icon={icons.get(loc.locationType) ?? icons.get("FRANCHISE_OUTLET")}
                eventHandlers={{ click: () => onSelectLocation?.(loc.id) }}
              >
                <Popup>
                  <div className="min-w-[200px] space-y-1 text-sm">
                    <div className="font-semibold">{loc.name}</div>
                    <div className="text-xs text-muted-foreground">{loc.code}</div>
                    <div className="flex gap-1 flex-wrap">
                      <Badge variant="secondary" className="text-[10px]">{LOCATION_TYPE_LABELS[loc.locationType] ?? loc.locationType}</Badge>
                      <Badge variant="outline" className="text-[10px]">{loc.businessStatus ?? loc.status}</Badge>
                    </div>
                    <div>{[loc.addressLine1, loc.city, loc.state, loc.country].filter(Boolean).join(", ")}</div>
                    {loc.brand?.name && <div>Brand: {loc.brand.name}</div>}
                    {loc.franchisee && <div>Franchisee: {loc.franchisee.tradingName ?? loc.franchisee.legalName}</div>}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        )}
      </MapContainer>
    </div>
  );
}
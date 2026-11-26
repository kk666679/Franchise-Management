"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { FeatureCollection } from "geojson";
import type { PathOptions } from "leaflet";

import { GEO_CONFIG } from "@/lib/geo/config";

interface LeafletMapProps {
  data?: FeatureCollection;
  height?: string;
  zoom?: number;
}

const featureStyle: PathOptions = {
  color: "#2563eb",
  weight: 2,
  fillColor: "#3b82f6",
  fillOpacity: 0.2,
};

export default function LeafletMap({
  data,
  height = "500px",
  zoom = GEO_CONFIG.defaultZoom,
}: LeafletMapProps) {
  return (
    <div style={{ width: "100%", height, borderRadius: "12px", overflow: "hidden" }}>
      <MapContainer
        center={[GEO_CONFIG.defaultCenter.lat, GEO_CONFIG.defaultCenter.lng]}
        zoom={zoom}
        minZoom={GEO_CONFIG.minZoom}
        maxZoom={GEO_CONFIG.maxZoom}
        scrollWheelZoom
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer attribution={GEO_CONFIG.tiles.attribution} url={GEO_CONFIG.tiles.url} />
        {data && <GeoJSON key={JSON.stringify(data)} data={data} style={() => featureStyle} />}
      </MapContainer>
    </div>
  );
}

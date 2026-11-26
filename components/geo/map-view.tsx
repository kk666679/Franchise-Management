"use client";

import dynamic from "next/dynamic";
import type { FeatureCollection } from "geojson";

const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full animate-pulse rounded-xl bg-muted" />,
});

interface MapViewProps {
  data?: FeatureCollection;
  height?: string;
  zoom?: number;
}

export default function MapView(props: MapViewProps) {
  return <LeafletMap {...props} />;
}

"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const LeafletGeoMap = dynamic(() => import("./LeafletGeoMapInner").then((m) => m.LeafletGeoMapInner), {
  ssr: false,
  loading: () => <Skeleton className="h-[600px] w-full rounded-2xl" />,
});

export type { GeoLocationRecord, GeoTerritoryRecord } from "./LeafletGeoMapInner";
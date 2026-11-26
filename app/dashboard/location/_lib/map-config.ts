export const GEO_CONFIG = {
  defaultCenter: {
    lat: 3.139,
    lng: 101.6869,
  },
  defaultZoom: 12,
  minZoom: 5,
  maxZoom: 19,
  country: "MY",
  countryName: "Malaysia",
  timezone: "Asia/Kuala_Lumpur",
  crs: "EPSG:4326",
  tiles: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
} as const;

// Leaflet uses [lat, lng]; GeoJSON uses [lng, lat].
export const DEFAULT_CENTER: [number, number] = [
  GEO_CONFIG.defaultCenter.lat,
  GEO_CONFIG.defaultCenter.lng,
];
export const DEFAULT_ZOOM = GEO_CONFIG.defaultZoom;

export const TILE_LAYERS = {
  osm: {
    name: "OpenStreetMap",
    url: GEO_CONFIG.tiles.url,
    attribution: GEO_CONFIG.tiles.attribution,
  },
  cartoLight: {
    name: "Carto Light",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap &copy; CARTO",
  },
  cartoDark: {
    name: "Carto Dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap &copy; CARTO",
  },
  esriSatellite: {
    name: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  },
} as const;

export type TileLayerKey = keyof typeof TILE_LAYERS;

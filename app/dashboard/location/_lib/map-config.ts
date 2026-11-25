import "leaflet/dist/leaflet.css";

export const DEFAULT_CENTER: [number, number] = [39.8283, -98.5795];
export const DEFAULT_ZOOM = 4;

export const TILE_LAYERS = {
  osm: { name: "OpenStreetMap", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' },
  cartoLight: { name: "Carto Light", url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", attribution: '&copy; OpenStreetMap &copy; CARTO' },
  cartoDark: { name: "Carto Dark", url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", attribution: '&copy; OpenStreetMap &copy; CARTO' },
  esriSatellite: { name: "Satellite", url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", attribution: 'Tiles &copy; Esri' },
} as const;

export type TileLayerKey = keyof typeof TILE_LAYERS;

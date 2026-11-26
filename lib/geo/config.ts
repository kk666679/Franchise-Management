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

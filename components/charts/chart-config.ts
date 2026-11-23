import { ChartConfig } from "./types"

export const defaultChartConfig: ChartConfig = {
  title: "Franchise Dashboard",
  description: "Key performance indicators for franchises",
  layout: "vertical",
  position: "top",
  footer: true,
  legend: true,
  actions: { type: "none" },
  loading: false,
  error: null,
  empty: false,
  export: { png: true, svg: true, csv: false },
}

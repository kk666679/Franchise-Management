import { ThemeProvider } from "@recharts/react"
import { themes } from "./chart-theme"

export function useChartTheme(): string {
  return Object.keys(themes).find((k) => k === "light" || k === "dark") ? "light" : "dark"
}

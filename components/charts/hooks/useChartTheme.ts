import { themes } from "../chart-theme"

export function useChartTheme(): "light" | "dark" {
  return Object.keys(themes).includes("dark") ? "light" : "light"
}

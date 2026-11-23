export const lightTheme = {
  background: "#ffffff",
  foreground: "#111827",
  muted: "#6b7280",
  grid: "#e5e7eb",
}

export const darkTheme = {
  background: "#111827",
  foreground: "#f9fafb",
  muted: "#9ca3af",
  grid: "#374151",
}

export const themes = {
  light: lightTheme,
  dark: darkTheme,
}

export type ChartTheme = typeof lightTheme
export const defaultTheme: ChartTheme = lightTheme

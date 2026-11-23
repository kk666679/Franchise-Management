import { ThemeProvider } from "@recharts/styles"
import { lightTheme, darkTheme } from "./chart-theme"

export const themes = {
  light: lightTheme,
  dark: darkTheme,
}

export const defaultTheme: typeof lightTheme = lightTheme

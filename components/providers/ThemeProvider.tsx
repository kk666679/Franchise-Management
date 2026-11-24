"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: "light" | "dark"
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
  root.style.colorScheme = theme
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()
  React.useEffect(() => {
    function isTypingTarget(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) return false
      return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key.toLowerCase() !== "d") return
      if (isTypingTarget(event.target)) return
      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [resolvedTheme, setTheme])
  return null
}

export function ThemeProvider({ children }: { children: React.ReactNode; attribute?: string; defaultTheme?: string; enableSystem?: boolean; disableTransitionOnChange?: boolean }) {
  const [theme, setThemeState] = React.useState<Theme>("dark")
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">("dark")

  React.useEffect(() => {
    const stored = (localStorage.getItem("theme") as Theme | null) ?? "dark"
    setThemeState(stored)
  }, [])

  React.useEffect(() => {
    const resolved = theme === "system" ? getSystemTheme() : theme
    setResolvedTheme(resolved)
    applyTheme(resolved)
  }, [theme])

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next)
    localStorage.setItem("theme", next)
  }, [])

  const value = React.useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme])

  return (
    <ThemeContext.Provider value={value}>
      <ThemeHotkey />
      {children}
    </ThemeContext.Provider>
  )
}

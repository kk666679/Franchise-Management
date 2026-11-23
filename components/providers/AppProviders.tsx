"use client"

import * as React from "react"
import { QueryProvider } from "./QueryProvider"
import { RealtimeProvider, SessionProvider } from "./SessionProvider"
import { ThemeProvider } from "./ThemeProvider"
import { ToastProvider } from "./ToastProvider"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <QueryProvider>
          <RealtimeProvider>
            <ToastProvider>{children}</ToastProvider>
          </RealtimeProvider>
        </QueryProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}

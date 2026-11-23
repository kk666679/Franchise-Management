"use client"

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
      },
    },
  })
}

let browserClient: QueryClient | undefined

function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient()
  browserClient ??= makeQueryClient()
  return browserClient
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(getQueryClient)
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

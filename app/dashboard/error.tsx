"use client"

import { useEffect } from "react"

import { ErrorState } from "@/components/feedback"

type DashboardErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("Dashboard error:", error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <ErrorState
          title="Dashboard failed to load"
          description={
            error.message ||
            "An unexpected error occurred while loading this page. Try again, or check server logs if the problem persists."
          }
          onRetry={reset}
        />
        {error.digest ? (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        ) : null}
      </div>
    </div>
  )
}

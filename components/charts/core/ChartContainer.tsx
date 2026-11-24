import type { ReactNode } from "react"

export interface ChartContainerProps {
  children: ReactNode
  title?: string
  description?: string
  className?: string
  loading?: boolean
  error?: { message?: string } | null
  empty?: boolean
}

export function ChartContainer({
  children,
  title,
  description,
  className,
  loading,
  error,
  empty,
}: ChartContainerProps) {
  return (
    <div className={className ?? "flex flex-col gap-4 p-4"}>
      {title ? <h2 className="text-xl font-semibold">{title}</h2> : null}
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
      {error ? (
        <div className="rounded border border-red-400 bg-red-100 px-3 py-2 text-red-700">
          {error.message ?? "Chart error"}
        </div>
      ) : null}
      {empty ? (
        <div className="rounded border border-gray-300 bg-gray-100 py-2 text-gray-500">
          No data available
        </div>
      ) : null}
      {loading ? (
        <div className="mt-2 animate-pulse rounded border border-gray-300 bg-gray-200">
          Loading...
        </div>
      ) : (
        children
      )}
    </div>
  )
}

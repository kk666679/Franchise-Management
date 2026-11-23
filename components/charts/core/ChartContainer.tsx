import { ReactNode } from "react"
import { ResponsiveContainer } from "@recharts/react"

export interface ChartContainerProps {
  children: ReactNode
  title?: string
  description?: string
  actions?: ActionConfig
  loading?: boolean
  error?: ErrorState
  empty?: boolean
  footer?: boolean
  legend?: boolean
}

interface ActionConfig {
  type?: "none" | "edit" | "delete"
  onClick?: () => void
}

interface ErrorState {
  message?: string
}

interface ChartLoadingProps {
  isLoading?: boolean
}

interface ChartSkeletonProps {
  size?: number
}

interface ChartExportProps {
  filename?: string
  format?: "png" | "svg" | "csv"
}

export function ChartContainer({
  children,
  title,
  description,
  actions,
  loading,
  error,
  empty,
  footer,
  legend,
}: ChartContainerProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {title && <h2 className="text-xl font-semibold">{title}</h2>}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {children}
      {footer && <footer className="border-t pt-4 text-center text-sm text-muted-foreground">Footer</footer>}
      {legend && <ul className="flex items-center gap-3 mt-2">{legend?.items?.map((item) => (
        <li key={item.label} className="flex items-center gap-1">
          <span className="text-xs font-medium">{item.label}</span>
          <span className="text-xs text-muted-foreground">{item.color}</span>
        </li>
      )))}</ul>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mt-2">{error.message}</div>}
      {empty && <div className="bg-gray-100 border border-gray-300 text-gray-500 py-2 rounded mt-2">No data available</div>}
      {loading && <div className="animate-pulse bg-gray-200 border border-gray-300 rounded mt-2">Loading...</div>}
    </div>
  )
}

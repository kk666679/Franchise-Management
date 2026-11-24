import type { ActionConfig } from "../types"

export interface ChartHeaderProps {
  title?: string
  description?: string
  actions?: ActionConfig
}

export function ChartHeader({ title, description, actions }: ChartHeaderProps) {
  return (
    <header className="mb-4 border-b border-gray-200 pb-2">
      {title ? <h1 className="text-lg font-bold">{title}</h1> : null}
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
      {actions?.type && actions.type !== "none" ? (
        <div className="mt-2">
          <button
            type="button"
            className="rounded px-3 py-1 text-sm hover:bg-accent"
            onClick={actions.onClick}
          >
            {actions.type}
          </button>
        </div>
      ) : null}
    </header>
  )
}

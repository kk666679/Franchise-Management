import { AuthorizationContext } from "./core/ChartHeader"

export interface ChartHeaderProps {
  title?: string
  description?: string
  actions?: ActionConfig
}

export function ChartHeader({ title, description, actions }: ChartHeaderProps) {
  return (
    <header className="border-b border-gray-200 mb-4 pb-2">
      <h1 className="text-lg font-bold">{title || "Chart Header"}</h1>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {actions && <div className="mt-2 space-y-1"><button className="px-3 py-1 rounded text-sm hover:bg-accent transition">{actions.type === "none" ? "Edit" : actions.type === "delete" ? "Delete" : "Action"}</button></div>}
    </header>
  )
}

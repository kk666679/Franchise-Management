export type WidgetSize = "sm" | "md" | "lg" | "xl" | "full"

export type WidgetStatus = "default" | "loading" | "empty" | "error" | "success" | "warning"

export type WidgetTrendDirection = "up" | "down" | "flat"

export type WidgetDensity = "comfortable" | "compact"

export type WidgetAction = {
  id: string
  label: string
  icon?: React.ReactNode
  onSelect?: () => void
  disabled?: boolean
  destructive?: boolean
  shortcut?: string
}

export type WidgetMetric = {
  id: string
  label: string
  value: string | number
  previousValue?: string | number
  change?: number
  changeLabel?: string
  trend?: WidgetTrendDirection
  icon?: React.ReactNode
  href?: string
}

export type WidgetFeedItem = {
  id: string
  title: string
  description?: string
  timestamp?: string | Date
  status?: "info" | "success" | "warning" | "error" | "neutral"
  actor?: { name: string; avatarUrl?: string }
  href?: string
  meta?: string
}

export interface WidgetShellProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: WidgetSize
  status?: WidgetStatus
  density?: WidgetDensity
  interactive?: boolean
  selected?: boolean
}

export interface WidgetHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode
  description?: React.ReactNode
  eyebrow?: React.ReactNode
  icon?: React.ReactNode
  actions?: React.ReactNode
  badge?: React.ReactNode
  meta?: React.ReactNode
}

export interface WidgetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  bleed?: boolean
}

export interface WidgetFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: "start" | "between" | "end"
}

/**
 * Phase 7 — Widget registry metadata.
 * Pure data and types — no JSX, no runtime deps beyond the project's own types.
 */

export type WidgetKind =
  | "kpi"
  | "revenue"
  | "applications"
  | "compliance"
  | "approvals"
  | "activity"

export type WidgetSize = "sm" | "md" | "lg"

export type WidgetDefinition = {
  kind: WidgetKind
  label: string
  description: string
  defaultSize: WidgetSize
  /** Permission required to view this widget. Undefined = visible to all. */
  permission?: string
}

export const WIDGET_DEFINITIONS: Record<WidgetKind, WidgetDefinition> = {
  kpi: {
    kind: "kpi",
    label: "Key metrics",
    description: "Active brands, outlets, franchisees and payment totals.",
    defaultSize: "sm",
  },
  revenue: {
    kind: "revenue",
    label: "Revenue activity",
    description: "Collected payments over the last 7 days.",
    defaultSize: "lg",
    permission: "finance:read",
  },
  applications: {
    kind: "applications",
    label: "Recent applications",
    description: "Latest franchise applications and their status.",
    defaultSize: "md",
    permission: "franchise:read",
  },
  compliance: {
    kind: "compliance",
    label: "Compliance overview",
    description: "Inspection scores and open corrective actions.",
    defaultSize: "md",
    permission: "operations:read",
  },
  approvals: {
    kind: "approvals",
    label: "Pending approvals",
    description: "Workflows awaiting your action.",
    defaultSize: "md",
  },
  activity: {
    kind: "activity",
    label: "Activity feed",
    description: "Recent audit events across the network.",
    defaultSize: "md",
    permission: "audit:read",
  },
}

/** Default widget layout per role — ordered list of widget kinds. */
export const ROLE_DEFAULT_LAYOUTS: Record<string, WidgetKind[]> = {
  OWNER: ["kpi", "revenue", "applications", "approvals", "compliance", "activity"],
  ADMIN: ["kpi", "revenue", "applications", "approvals", "compliance", "activity"],
  MANAGER: ["kpi", "applications", "approvals", "compliance", "activity"],
  STAFF: ["kpi", "activity"],
  VIEWER: ["kpi", "revenue", "compliance", "activity"],
}

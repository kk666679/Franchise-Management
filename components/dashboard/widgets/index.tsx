import type { DashboardData } from "@lib/server/dashboard"
import { StatusIndicator } from "@/components/shared/status-indicator"
import { CurrencyDisplay } from "@/components/shared/currency-display"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  CircleDollarSign,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react"
import Link from "next/link"

// ── KPI Widget ────────────────────────────────────────────────────────────────

type KPIWidgetProps = {
  metrics: DashboardData["metrics"]
  currency: string
}

export function KPIWidget({ metrics, currency }: KPIWidgetProps) {
  const items = [
    { label: "Active brands", value: String(metrics.brands), icon: Building2 },
    {
      label: "Active outlets",
      value: String(metrics.activeLocations),
      icon: Store,
    },
    { label: "Franchisees", value: String(metrics.franchisees), icon: Users },
    {
      label: "Collected",
      value: new Intl.NumberFormat("en", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(metrics.collectedThisMonth),
      icon: CircleDollarSign,
    },
  ]

  return (
    <section aria-label="Key metrics" className="rounded-2xl p-5 glass">
      <h2 className="mb-4 text-sm text-muted-foreground">Key metrics</h2>
      <div className="grid grid-cols-2 gap-3">
        {items.map(({ label, value, icon: Icon }) => (
          <div key={label} className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Icon className="size-3" aria-hidden="true" />
              {label}
            </div>
            <p className="text-lg font-semibold tabular-nums">{value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Compliance Widget ─────────────────────────────────────────────────────────

export function ComplianceWidget() {
  return (
    <section aria-label="Compliance" className="rounded-2xl p-5 glass">
      <div className="mb-4 flex items-center gap-2">
        <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
        <h2 className="text-sm font-medium">Compliance</h2>
      </div>
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <p className="text-3xl font-semibold text-emerald-500">—</p>
        <p className="mt-1 text-xs text-muted-foreground">Network score</p>
        <p className="mt-4 text-xs text-muted-foreground">
          Compliance module available in Phase 13.
        </p>
      </div>
    </section>
  )
}

// ── Approvals Widget ──────────────────────────────────────────────────────────

export function ApprovalsWidget() {
  return (
    <section aria-label="Pending approvals" className="rounded-2xl p-5 glass">
      <h2 className="mb-4 text-sm font-medium">Pending approvals</h2>
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <p className="text-3xl font-semibold">—</p>
        <p className="mt-1 text-xs text-muted-foreground">Awaiting action</p>
        <p className="mt-4 text-xs text-muted-foreground">
          Approval workflows available in Phase 15.
        </p>
      </div>
    </section>
  )
}

// ── Activity Widget ───────────────────────────────────────────────────────────

type ActivityWidgetProps = {
  applications: DashboardData["applications"]
}

const STATUS_TONE = {
  DRAFT: "neutral",
  SUBMITTED: "info",
  UNDER_REVIEW: "warning",
  APPROVED: "success",
  REJECTED: "danger",
  WITHDRAWN: "neutral",
} as const

const dateFmt = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
})

export function ActivityWidget({ applications }: ActivityWidgetProps) {
  return (
    <section aria-label="Recent applications" className="rounded-2xl p-5 glass">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium">Recent applications</h2>
        <Link
          href="/dashboard/applications"
          className="text-xs text-primary hover:underline"
        >
          View all
        </Link>
      </div>
      {applications.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted-foreground">
          No applications yet.
        </p>
      ) : (
        <ul className="divide-y divide-border/60">
          {applications.map((app) => (
            <li key={app.id}>
              <Link
                href={`/dashboard/applications/${app.id}`}
                className="-mx-1 flex items-center justify-between gap-3 rounded-lg px-1 py-3 transition-colors hover:bg-muted/20"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {app.franchiseeName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {app.referenceNo} · {app.brandName}
                  </p>
                </div>
                <StatusIndicator
                  label={app.status.replace(/_/g, " ")}
                  tone={
                    STATUS_TONE[app.status as keyof typeof STATUS_TONE] ??
                    "neutral"
                  }
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

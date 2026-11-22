import { FileText, Plus } from "lucide-react"
import Link from "next/link"

import { AppShell } from "@/components/layout/app-shell"
import { PageContainer } from "@/components/layout/page-container"
import { PageHeader } from "@/components/layout/page-header"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { StatusIndicator } from "@/components/shared/status-indicator"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/feedback/empty-state"
import { getCurrentSession } from "@lib/server/auth/session"
import { resolvePermissions } from "@lib/server/auth"
import { visibleDestinations } from "@/lib/navigation"
import { prisma } from "@/lib/prisma"
import { type ApplicationStatus } from "@prisma/client"

async function getApplications(orgId: string) {
  return prisma.franchiseApplication.findMany({
    where: { organizationId: orgId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      referenceNo: true,
      status: true,
      submittedAt: true,
      updatedAt: true,
      brand: { select: { name: true } },
      franchisee: { select: { legalName: true, tradingName: true } },
    },
  })
}

const COLUMNS: { status: ApplicationStatus; label: string; tone: "neutral" | "info" | "warning" | "success" | "danger" }[] = [
  { status: "DRAFT", label: "Draft", tone: "neutral" },
  { status: "SUBMITTED", label: "Submitted", tone: "info" },
  { status: "UNDER_REVIEW", label: "Under review", tone: "warning" },
  { status: "APPROVED", label: "Approved", tone: "success" },
  { status: "REJECTED", label: "Rejected", tone: "danger" },
]

const fmt = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" })

export default async function ApplicationsPage() {
  const session = await getCurrentSession()
  
  const applications = await getApplications(session?.org ?? "")
  const granted = resolvePermissions([], session?.role ?? undefined)
  const navigation = visibleDestinations(granted)

  const byStatus = Object.fromEntries(
    COLUMNS.map((col) => [
      col.status,
      applications.filter((a) => a.status === col.status),
    ]),
  ) as Record<ApplicationStatus, typeof applications>

  return (
    <AppShell
      brand={
        <span className="flex items-center gap-2 text-sm font-semibold">
          <FileText className="size-4 text-primary" />
          Franchise Management
        </span>
      }
      sidebar={<DashboardNav items={navigation} />}
    >
      <PageContainer className="space-y-6">
        <PageHeader
          title="Applications"
          description={`${applications.length} total across all stages`}
          actions={
            <Button className="rounded-full" size="sm">
              <Plus className="size-4" />
              New application
            </Button>
          }
        />

        {applications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            description="New franchise applications will appear here."
            icon={<FileText className="size-5" />}
          />
        ) : (
          <div className="grid min-w-0 gap-4 overflow-x-auto pb-2 lg:grid-cols-5">
            {COLUMNS.map((col) => {
              const items = byStatus[col.status] ?? []
              return (
                <div key={col.status} className="min-w-[220px] space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <StatusIndicator label={col.label} tone={col.tone} />
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {items.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {items.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                        None
                      </div>
                    ) : (
                      items.map((app) => (
                        <Link
                          key={app.id}
                          href={`/dashboard/applications/${app.id}`}
                          className="glass block min-w-0 rounded-2xl p-4 transition-shadow hover:shadow-lg"
                        >
                          <p className="truncate text-sm font-medium">
                            {app.franchisee?.tradingName ??
                              app.franchisee?.legalName ??
                              "Unassigned"}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {app.referenceNo} · {app.brand.name}
                          </p>
                          {app.submittedAt && (
                            <p className="mt-2 text-[10px] text-muted-foreground/70">
                              Submitted {fmt.format(app.submittedAt)}
                            </p>
                          )}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </PageContainer>
    </AppShell>
  )
}


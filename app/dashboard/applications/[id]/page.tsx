import { notFound } from "next/navigation"
import { FileText } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { StatusIndicator } from "@/components/shared/status-indicator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PERMISSIONS } from "@/lib/rbac"
import { prisma } from "@/lib/prisma"

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
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

async function getApplication(orgId: string, id: string) {
  const app = await prisma.franchiseApplication.findUnique({
    where: { id },
    include: {
      brand: { select: { id: true, name: true } },
      franchisee: {
        select: {
          id: true,
          legalName: true,
          tradingName: true,
          email: true,
          phone: true,
        },
      },
      submittedBy: { select: { id: true, name: true, email: true } },
      agreement: { select: { id: true, agreementNo: true, status: true } },
      documents: {
        select: { id: true, name: true, type: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
    },
  })
  if (!app || app.organizationId !== orgId) return null
  return app
}

const TIMELINE = [
  { status: "DRAFT", label: "Draft created" },
  { status: "SUBMITTED", label: "Submitted" },
  { status: "UNDER_REVIEW", label: "Under review" },
  { status: "APPROVED", label: "Approved" },
] as const

const STATUS_ORDER = [
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "WITHDRAWN",
]

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const organizationId = (await prisma.organization.findFirst({ select: { id: true } }))?.id ?? ""
  
  const ctx = {
    userId: "",
    organizationId: organizationId,
    membershipRole: "OWNER",
  }

  const app = await getApplication(organizationId, id)
  if (!app) notFound()
  const granted = new Set()
  const canReview = granted.has(PERMISSIONS.FRANCHISE_APPLICATION_REVIEW)
  const currentStep = STATUS_ORDER.indexOf(app.status)

  return (
    <div className="space-y-6">
<PageHeader
          title={`Application ${app.referenceNo}`}
          description={`${app.brand.name} · ${app.franchisee?.tradingName ?? app.franchisee?.legalName ?? "Unassigned applicant"}`}
          actions={
            <StatusIndicator
              label={app.status.replace(/_/g, " ")}
              tone={STATUS_TONE[app.status]}
            />
          }
        />

        {/* Status timeline */}
        <div className="rounded-2xl p-6 glass">
          <h2 className="mb-4 text-sm font-semibold">Progress</h2>
          <ol className="flex items-center gap-0">
            {TIMELINE.map((step, i) => {
              const stepIndex = STATUS_ORDER.indexOf(step.status)
              const done = currentStep > stepIndex
              const active = currentStep === stepIndex
              const isLast = i === TIMELINE.length - 1
              return (
                <li key={step.status} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                        done
                          ? "bg-primary text-primary-foreground"
                          : active
                            ? "bg-primary/10 text-primary ring-2 ring-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {done ? "✓" : i + 1}
                    </div>
                    <span className="text-[10px] whitespace-nowrap text-muted-foreground">
                      {step.label}
                    </span>
                  </div>
                  {!isLast && (
                    <div
                      className={`mx-2 h-px flex-1 ${done ? "bg-primary" : "bg-border"}`}
                    />
                  )}
                </li>
              )
            })}
          </ol>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Details */}
          <div className="space-y-4 rounded-2xl p-6 glass">
            <h2 className="font-semibold">Details</h2>
            <dl className="space-y-3 text-sm">
              {(
                [
                  ["Reference", app.referenceNo],
                  ["Brand", app.brand.name],
                  [
                    "Submitted",
                    app.submittedAt
                      ? dateFmt.format(app.submittedAt)
                      : "Not yet",
                  ],
                  [
                    "Reviewed",
                    app.reviewedAt ? dateFmt.format(app.reviewedAt) : "—",
                  ],
                  [
                    "Submitted by",
                    app.submittedBy?.name ?? app.submittedBy?.email ?? "—",
                  ],
                ] as [string, string][]
              ).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="mt-0.5 font-medium">{v}</dd>
                </div>
              ))}
              {app.decisionNotes && (
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Decision notes
                  </dt>
                  <dd className="mt-0.5 text-muted-foreground">
                    {app.decisionNotes}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Applicant */}
          <div className="space-y-4 rounded-2xl p-6 glass">
            <h2 className="font-semibold">Applicant</h2>
            {app.franchisee ? (
              <dl className="space-y-3 text-sm">
                {(
                  [
                    ["Legal name", app.franchisee.legalName],
                    ["Trading name", app.franchisee.tradingName ?? "—"],
                    ["Email", app.franchisee.email ?? "—"],
                    ["Phone", app.franchisee.phone ?? "—"],
                  ] as [string, string][]
                ).map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="mt-0.5 font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">
                No franchisee linked.
              </p>
            )}
          </div>
        </div>

        {/* Documents */}
        {app.documents.length > 0 && (
          <div className="space-y-4 rounded-2xl p-6 glass">
            <h2 className="font-semibold">Documents</h2>
            <ul className="divide-y divide-border/60">
              {app.documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between gap-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {dateFmt.format(doc.createdAt)}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {doc.type}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Review actions — server-rendered disabled state; real actions require server action */}
        {canReview && app.status === "UNDER_REVIEW" && (
          <div className="rounded-2xl p-6 glass">
            <h2 className="mb-4 font-semibold">Review actions</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Approval and rejection require an authorized server action. These
              controls are placeholders until the approval workflow is wired.
            </p>
            <div className="flex gap-3">
              <Button variant="default" disabled className="rounded-full">
                Approve application
              </Button>
              <Button variant="destructive" disabled className="rounded-full">
                Reject application
              </Button>
            </div>
          </div>
        )}
    </div>
  )
}

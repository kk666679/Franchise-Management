import { ArrowUpRight, Building2, CircleDollarSign, FileCheck2, Store } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { RecentApplications, type Application } from "@/components/dashboard/recent-applications"

const sampleApplications: Application[] = [
  { id: "app_1", referenceNo: "APP-2026-0142", status: "Pending review", brandName: "Harbor Coffee", franchiseeName: "Jordan Lee", submittedAt: new Date("2026-11-18") },
  { id: "app_2", referenceNo: "APP-2026-0141", status: "Approved", brandName: "Harbor Coffee", franchiseeName: "Maya Patel", submittedAt: new Date("2026-11-14") },
  { id: "app_3", referenceNo: "APP-2026-0140", status: "Awaiting documents", brandName: "Harbor Coffee", franchiseeName: "Morgan Chen", submittedAt: null },
]

const kpis = [
  { label: "Active locations", value: "24", change: "+2 this month", icon: Store },
  { label: "Pending applications", value: "3", change: "2 require review", icon: FileCheck2 },
  { label: "Active brands", value: "4", change: "Across 3 regions", icon: Building2 },
  { label: "Monthly revenue", value: "$128.4k", change: "+6.2% vs last month", icon: CircleDollarSign },
] as const

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        organizationName="Northstar Group"
        description="Monitor franchise performance, applications, and operational activity."
      />

      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.label} className="border-border/60 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                    <p className="text-2xl font-semibold tracking-tight">{kpi.value}</p>
                    <p className="text-xs text-muted-foreground">{kpi.change}</p>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-muted/30 p-2 text-muted-foreground">
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <RecentApplications applications={sampleApplications} />

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-semibold">Operational focus</CardTitle>
                <CardDescription>Items that need attention today.</CardDescription>
              </div>
              <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">3 items</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: "Review pending applications", detail: "2 applications waiting for initial review", href: "/dashboard/applications" },
              { title: "Check location compliance", detail: "Quarterly documents due for 4 locations", href: "/dashboard/location/directory" },
              { title: "Finance reconciliation", detail: "Outstanding invoices ready for follow-up", href: "/dashboard/finance" },
            ].map((item) => (
              <a key={item.title} href={item.href} className="group flex items-start justify-between gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
                <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" aria-hidden="true" />
              </a>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

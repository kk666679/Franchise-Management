import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type Application = {
  id: string
  referenceNo: string
  status: string
  brandName: string
  franchiseeName: string
  submittedAt: Date | null
}

type RecentApplicationsProps = { applications: Application[] }

const dateFormatter = new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" })

function statusStyle(status: string) {
  const s = status.toLowerCase()
  if (s.includes("approved") || s.includes("active")) return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
  if (s.includes("pending") || s.includes("review")) return "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400"
  if (s.includes("reject") || s.includes("declined")) return "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400"
  return "border-border/60 bg-muted/50 text-muted-foreground"
}

export function RecentApplications({ applications }: RecentApplicationsProps) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Recent applications</CardTitle>
        <CardDescription>Latest franchise applications and their review status.</CardDescription>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/20 px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">No applications yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/60 rounded-lg border border-border/60">
            {applications.map((app) => {
              const submittedAt = app.submittedAt ? dateFormatter.format(app.submittedAt) : null
              return (
                <li key={app.id} className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-foreground">{app.referenceNo}</p>
                      {submittedAt ? <span className="hidden text-xs text-muted-foreground sm:inline">· {submittedAt}</span> : null}
                    </div>
                    <p className="truncate text-sm text-muted-foreground">
                      {app.brandName} <span className="text-muted-foreground/60">/</span> {app.franchiseeName}
                    </p>
                    {submittedAt ? <p className="text-xs text-muted-foreground sm:hidden">{submittedAt}</p> : null}
                  </div>
                  <Badge variant="outline" className={cn("w-fit shrink-0 font-medium", statusStyle(app.status))}>
                    {app.status}
                  </Badge>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

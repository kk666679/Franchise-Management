import Link from "next/link"

type Application = {
  id: string
  referenceNo: string
  status: string
  brandName: string
  franchiseeName: string
  submittedAt: Date | null
}

function statusLabel(status: string) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase())
}

export function RecentApplications({
  applications,
}: {
  applications: Application[]
}) {
  return (
    <section
      className="min-w-0 rounded-2xl p-5 glass sm:p-6"
      aria-labelledby="applications-title"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Pipeline</p>
          <h2 id="applications-title" className="mt-1 text-lg font-semibold">
            Recent applications
          </h2>
        </div>
        <Link
          href="/dashboard/applications"
          className="text-xs font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border p-6 text-center">
          <p className="text-sm font-medium">No applications yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            New franchise applications will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-5 divide-y divide-border">
          {applications.map((application) => (
            <Link
              key={application.id}
              href={`/dashboard/applications/${application.id}`}
              className="flex min-w-0 items-center justify-between gap-4 py-3 first:pt-0 last:pb-0 hover:bg-muted/30"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {application.franchiseeName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {application.referenceNo} · {application.brandName}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                {statusLabel(application.status)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

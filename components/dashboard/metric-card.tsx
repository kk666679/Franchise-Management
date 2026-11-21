import type { LucideIcon } from "lucide-react"

type MetricCardProps = {
  label: string
  value: string
  detail: string
  icon: LucideIcon
}

export function MetricCard({ label, value, detail, icon: Icon }: MetricCardProps) {
  return (
    <article className="glass min-w-0 rounded-2xl p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="rounded-xl bg-primary/12 p-2 text-primary">
          <Icon className="size-4" />
        </div>
      </div>
      <p className="mt-5 truncate text-2xl font-semibold tracking-tight sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </article>
  )
}

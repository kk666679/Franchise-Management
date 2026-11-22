import type { LucideIcon } from "lucide-react"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type MetricCardProps = {
  label: string
  value: string
  detail: string
  icon: LucideIcon
  trend?: { value: number; label: string }
}

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  trend,
}: MetricCardProps) {
  const positive = trend && trend.value >= 0

  return (
    <article aria-label={`${label}: ${value}. ${detail}`} className="glass min-w-0 rounded-2xl p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="rounded-xl bg-primary/12 p-2 text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </div>
      </div>
      <dl>
        <dt className="sr-only">{label}</dt>
        <dd className="mt-5 truncate text-2xl font-semibold tracking-tight sm:text-3xl">{value}</dd>
      </dl>
      <div className="mt-1 flex items-center gap-2">
        <p className="text-xs text-muted-foreground">{detail}</p>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
              positive
                ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
                : "bg-red-500/12 text-red-600 dark:text-red-400",
            )}
          >
            {positive ? (
              <TrendingUpIcon className="size-3" aria-hidden="true" />
            ) : (
              <TrendingDownIcon className="size-3" aria-hidden="true" />
            )}
            {Math.abs(trend.value)}% {trend.label}
          </span>
        )}
      </div>
    </article>
  )
}

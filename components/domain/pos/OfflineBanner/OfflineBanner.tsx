import { WifiOff, Wifi } from "lucide-react"
import { cn } from "@/lib/utils"

export type OfflineBannerProps = {
  offline: boolean
  pendingCount?: number
  className?: string
}

export function OfflineBanner({ offline, pendingCount = 0, className }: OfflineBannerProps) {
  const Icon = offline ? WifiOff : Wifi
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center justify-between rounded-md border px-3 py-2 text-sm",
        offline
          ? "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200"
          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="size-4" aria-hidden="true" />
        <span>{offline ? "Offline mode" : "Online"}</span>
      </div>
      {pendingCount > 0 ? <span className="tabular-nums">{pendingCount} pending</span> : null}
    </div>
  )
}

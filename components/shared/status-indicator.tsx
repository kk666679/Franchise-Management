import { cn } from "@/lib/utils"

const tones = {
  neutral: "bg-muted text-muted-foreground",
  success: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  warning: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  danger: "bg-red-500/15 text-red-700 dark:text-red-300",
  info: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
} as const

export function StatusIndicator({ label, tone = "neutral", className }: { label: string; tone?: keyof typeof tones; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", tones[tone], className)}><span aria-hidden="true" className="size-1.5 rounded-full bg-current" />{label}</span>
}

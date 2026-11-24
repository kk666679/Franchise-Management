import { DateDisplay } from "@/components/shared/date-display"

export function FormattedDate({
  iso,
  className,
}: {
  iso: string
  className?: string
}) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return <span className={className}>—</span>
  return <DateDisplay value={d} className={className} />
}

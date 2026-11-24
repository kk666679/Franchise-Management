export function DateDisplay({
  value,
  dateStyle = "medium",
  className,
}: {
  value: Date | string | number | null | undefined
  dateStyle?: "full" | "long" | "medium" | "short"
  className?: string
}) {
  if (value === null || value === undefined)
    return <span className={className}>—</span>
  const date = new Date(value)
  if (Number.isNaN(date.valueOf()))
    return <span className={className}>Invalid date</span>
  return (
    <time className={className} dateTime={date.toISOString()}>
      {new Intl.DateTimeFormat("en", { dateStyle }).format(date)}
    </time>
  )
}

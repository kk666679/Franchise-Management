import { LoaderCircle } from "lucide-react"

export function LoadingSpinner({
  label = "Loading",
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <span aria-label={label} className={className} role="status">
      <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
    </span>
  )
}

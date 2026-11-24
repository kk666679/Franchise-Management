import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ErrorState({
  title = "Something went wrong",
  description = "We could not load this section.",
  onRetry,
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <div
      aria-live="polite"
      className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center"
    >
      <AlertTriangle
        aria-hidden="true"
        className="mb-3 size-6 text-destructive"
      />
      <h3 className="font-medium">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      {onRetry ? (
        <Button className="mt-4" onClick={onRetry} size="sm" variant="outline">
          Try again
        </Button>
      ) : null}
    </div>
  )
}

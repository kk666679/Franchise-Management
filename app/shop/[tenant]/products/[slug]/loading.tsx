/**
 * Loading UI for product detail route.
 */
export default function Loading() {
  return (
    <div className="px-4 py-8 flex flex-col gap-4">
      <div className="h-48 w-full rounded-xl bg-muted animate-pulse" />
      <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
      <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
    </div>
  )
}

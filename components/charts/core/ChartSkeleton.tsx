export interface ChartSkeletonProps {
  size?: number
}

export function ChartSkeleton({ size }: ChartSkeletonProps) {
  const height = typeof size === "number" ? size : 192
  return (
    <div
      className="w-full animate-pulse rounded bg-gray-200"
      style={{ height }}
      aria-hidden="true"
    />
  )
}

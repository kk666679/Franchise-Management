import { Skeleton } from "./ChartSkeleton"

export function ChartSkeleton({ size }: ChartSkeletonProps) {
  return (
    <div className="h-48 w-full bg-gray-200 rounded flex items-center justify-center">
      <Skeleton size={size} />
    </div>
  )
}

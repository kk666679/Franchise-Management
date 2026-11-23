export interface ChartLoadingProps {
  isLoading?: boolean
}

export function ChartLoading({ isLoading }: ChartLoadingProps) {
  if (!isLoading) return null
  return (
    <div className="flex h-16 w-full items-center justify-center rounded border-2 border-blue-500 bg-blue-50">
      <span className="text-lg font-medium">Loading chart...</span>
    </div>
  )
}

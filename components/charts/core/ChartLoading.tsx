import { LoadingSpinner } from "./ChartLoading"

export function ChartLoading({ isLoading }: ChartLoadingProps) {
  return isLoading ? (
    <div className="flex items-center justify-center h-16 w-full animate-spin rounded border-2 border-blue-500 bg-blue-50">
      <span className="text-lg font-medium">Loading chart...</span>
    </div>
  ) : null
}

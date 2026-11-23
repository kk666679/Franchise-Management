export interface ChartEmptyStateProps {
  message?: string
}

export function ChartEmptyState({ message }: ChartEmptyStateProps) {
  return (
    <div className="rounded border border-gray-300 bg-gray-100 p-4 text-center text-sm text-gray-500">
      {message ?? "No chart data to display"}
    </div>
  )
}

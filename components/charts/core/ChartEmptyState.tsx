import { ErrorState } from "./types"

export function ChartEmptyState({ message }: ChartEmptyStateProps) {
  return (
    <div className="bg-gray-100 border border-gray-300 rounded p-4 text-center text-sm">
      {message ? `<p className="text-red-600">${message}</p>` : "No chart data to display"}
    </div>
  )
}

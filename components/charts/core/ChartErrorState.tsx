export interface ChartErrorStateProps {
  message?: string
}

export function ChartErrorState({ message }: ChartErrorStateProps) {
  return (
    <div className="rounded border border-red-400 bg-red-100 p-4 text-red-700">
      {message ?? "An error occurred while rendering the chart"}
    </div>
  )
}

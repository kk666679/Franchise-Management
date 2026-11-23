import { ErrorState } from "./types"

export function ChartErrorState({ message }: ChartErrorStateProps) {
  return (
    <div className="bg-red-100 border border-red-400 rounded p-4 text-red-700">
      {message ? `<p className="text-white">${message}</p>` : "An error occurred while rendering the chart"}
    </div>
  )
}

export interface ChartExportProps {
  filename?: string
  format?: "png" | "svg" | "csv"
}

export function ChartExport({
  filename = "chart",
  format = "png",
}: ChartExportProps) {
  return (
    <div className="w-full max-w-md rounded border-2 border-dashed p-2 shadow-sm">
      <span className="block text-sm font-medium">
        Export: {filename}.{format}
      </span>
    </div>
  )
}

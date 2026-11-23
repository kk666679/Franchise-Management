import { ExportOption } from "./types"

export function ChartExport({ filename, format }: ChartExportProps) {
  const formats: Record<string, string> = { png: "png", svg: "svg", csv: "csv" }
  const ext = format === "png" ? ".png" : format === "svg" ? ".svg" : ".csv"
  return (
    <div className="w-full max-w-md border-2 border-dashed rounded shadow-sm">
      <label className="block text-sm font-medium mb-2">Export</label>
      <select value={filename} onChange={(e) => {}}>
        <option value="">-- Select --</option>
      </select>
      <select value={format} onChange={(e) => {}}>
        <option value="png">PNG</option>
        <option value="svg">SVG</option>
        <option value="csv">CSV</option>
      </select>
    </div>
  )
}

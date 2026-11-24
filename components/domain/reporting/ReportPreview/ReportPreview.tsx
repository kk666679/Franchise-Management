import { Card } from "@/components/ui/card"
import type { ReportPreviewProps } from "./ReportPreview.types"

export function ReportPreview({ rows }: ReportPreviewProps) {
  return (
    <Card className="space-y-3 p-4">
      <h3 className="font-semibold">Preview</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No preview data.</p>
      ) : (
        <div className="overflow-auto">
          <pre className="text-xs">
            {JSON.stringify(rows.slice(0, 20), null, 2)}
          </pre>
        </div>
      )}
    </Card>
  )
}

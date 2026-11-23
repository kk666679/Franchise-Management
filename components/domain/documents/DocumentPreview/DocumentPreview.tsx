import { Card } from '@/components/ui/card'
import type { DocumentPreviewProps } from './DocumentPreview.types'

export function DocumentPreview({ document }: DocumentPreviewProps) {
  return (
    <Card className="p-4 space-y-2">
      <h3 className="font-semibold">{document.name}</h3>
      <p className="text-sm text-muted-foreground">Category: {document.category} · v{document.version}</p>
      <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Preview not available.</div>
    </Card>
  )
}

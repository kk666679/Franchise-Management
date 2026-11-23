import { Card } from '@/components/ui/card'
import type { ComplianceEvidenceListProps } from './ComplianceEvidenceList.types'

export function ComplianceEvidenceList({ evidence }: ComplianceEvidenceListProps) {
  return (
    <Card className="p-4 space-y-3">
      <h3 className="font-semibold">Evidence</h3>
      {evidence.length === 0 ? <p className="text-sm text-muted-foreground">No evidence uploaded.</p> : (
        <ul className="divide-y divide-border">
          {evidence.map((e) => (
            <li key={e.id} className="py-2 text-sm flex justify-between">
              <span>{e.fileName}</span>
              <span className="text-muted-foreground">{e.uploadedAtIso.slice(0,10)}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

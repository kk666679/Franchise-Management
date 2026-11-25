import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/page-header'
import { Section } from '@/components/layout/Section'
import { TerritoryConflictBadge } from '../TerritoryConflictBadge'
import type { TerritoryView } from '../mappers'

export function TerritoryDetail({ territory }: { territory: TerritoryView }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={territory.name}
        description={territory.region}
        actions={territory.hasConflict ? <TerritoryConflictBadge /> : null}
      />
      <Section title="Assignment">
        <Card className="p-4">
          <dl>
            <dt className="text-sm text-muted">Assigned to</dt>
            <dd className="text-base font-medium">{territory.franchiseName ?? 'Unassigned'}</dd>
          </dl>
        </Card>
      </Section>
    </div>
  )
}

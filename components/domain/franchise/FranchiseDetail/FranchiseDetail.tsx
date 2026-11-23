import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'
import { Section } from '@/components/layout/Section'
import { FormattedDate } from '@/components/common/FormattedDate'
import { FranchiseStatusBadge } from '../FranchiseStatusBadge'
import type { FranchiseView } from '../mappers'

export function FranchiseDetail({ franchise }: { franchise: FranchiseView }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={franchise.name}
        description={franchise.legalName ?? undefined}
        actions={<FranchiseStatusBadge status={franchise.status} />}
      />

      <Section title="Overview">
        <Card className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
          <Field label="Organization" value={franchise.organizationName} />
          <Field label="Territory" value={franchise.territoryName ?? '—'} />
          <Field label="Branches" value={String(franchise.branchCount)} />
          <Field label="Created" value={<FormattedDate iso={franchise.createdAtIso} />} />
        </Card>
      </Section>
    </div>
  )
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-base font-medium">{value}</dd>
    </div>
  )
}

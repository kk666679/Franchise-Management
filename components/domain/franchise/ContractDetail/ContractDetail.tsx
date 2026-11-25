import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/page-header'
import { Section } from '@/components/layout/Section'
import { FormattedDate } from '@/components/common/FormattedDate'
import { ContractLifecycleBadge } from '../ContractLifecycleBadge'
import { ContractTimeline, type TimelineEvent } from '../ContractTimeline'
import type { ContractView } from '../mappers'

export function ContractDetail({
  contract,
  events,
}: {
  contract: ContractView
  events: TimelineEvent[]
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={contract.franchiseName}
        description="Contract"
        actions={<ContractLifecycleBadge status={contract.status} />}
      />
      <Section title="Term">
        <Card className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3">
          <Field label="Effective from" value={<FormattedDate iso={contract.effectiveFromIso} />} />
          <Field
            label="Effective to"
            value={contract.effectiveToIso ? <FormattedDate iso={contract.effectiveToIso} /> : 'Open-ended'}
          />
          <Field label="Royalty" value={`${contract.royaltyRatePct}%`} />
        </Card>
      </Section>
      <Section title="History">
        <ContractTimeline events={events} />
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

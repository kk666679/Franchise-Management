import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/layout/PageHeader'
import { Section } from '@/components/layout/Section'
import { FormattedDate } from '@/components/common/FormattedDate'
import { OrganizationStatusBadge } from '../OrganizationStatusBadge'
import type { OrganizationView } from '../mappers'

export function OrganizationDetail({ organization }: { organization: OrganizationView }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={organization.name}
        description={organization.legalName}
        actions={<OrganizationStatusBadge status={organization.status} />}
      />
      <Section title="Overview">
        <Card className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3">
          <Field label="Franchises" value={String(organization.franchiseCount)} />
          <Field label="Branches" value={String(organization.branchCount)} />
          <Field label="Created" value={<FormattedDate iso={organization.createdAtIso} />} />
        </Card>
      </Section>
    </div>
  )
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-base font-medium tabular-nums">{value}</dd>
    </div>
  )
}

import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/page-header'
import { Section } from '@/components/layout/Section'
import { FormattedDate } from '@/components/common/FormattedDate'
import { OrganizationStatusBadge } from '../OrganizationStatusBadge'
import type { OrganizationView } from '../mappers'
import type { OrganizationStatus } from '../OrganizationStatusBadge/OrganizationStatusBadge.types'

export function OrganizationDetail({ organization }: { organization: OrganizationView }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={organization.name}
        description={organization.legalName}
        actions={<OrganizationStatusBadge status={organization.status as OrganizationStatus} />}
      />
      <Section title="Overview">
        <Card className="p-4">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Franchises" value={String(organization.franchiseCount)} />
            <Field label="Branches" value={String(organization.branchCount)} />
            <Field label="Created" value={<FormattedDate iso={organization.createdAtIso} />} />
          </dl>
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

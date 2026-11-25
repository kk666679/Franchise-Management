import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/layout/PageHeader'
import { Section } from '@/components/layout/Section'
import { BranchStatusBadge } from '../BranchStatusBadge'
import type { BranchView } from '../mappers'

export function BranchDetail({ branch }: { branch: BranchView }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={branch.name}
        description={branch.franchiseName}
        actions={<BranchStatusBadge isActive={branch.isActive} />}
      />
      <Section title="Address">
        <Card className="p-4">
          <p>{branch.addressLine}</p>
          <p className="text-muted">{branch.city}, {branch.region}</p>
        </Card>
      </Section>
    </div>
  )
}

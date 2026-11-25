import { Card } from '@/components/ui/Card'
import type { FranchiseView } from '../mappers'

export type FranchiseStatsProps = {
  franchise: FranchiseView
  activeBranches: number
  expiringContracts: number
}

export function FranchiseStats({ franchise, activeBranches, expiringContracts }: FranchiseStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Stat label="Branches" value={String(franchise.branchCount)} />
      <Stat label="Active branches" value={String(activeBranches)} />
      <Stat label="Expiring contracts" value={String(expiringContracts)} tone={expiringContracts > 0 ? 'warn' : 'default'} />
      <Stat label="Status" value={franchise.status} />
    </div>
  )
}

function Stat({ label, value, tone = 'default' }: { label: string; value: string; tone?: 'default' | 'warn' }) {
  return (
    <Card className="p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${tone === 'warn' ? 'text-amber-700' : ''}`}>
        {value}
      </p>
    </Card>
  )
}

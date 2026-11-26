import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { FranchiseStatusBadge } from '../FranchiseStatusBadge'
import type { FranchiseView } from '../mappers'

export function FranchiseSummaryCard({ franchise }: { franchise: FranchiseView }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link href={`/dashboard/franchises/${franchise.id}`} className="text-base font-semibold hover:underline">
            {franchise.name}
          </Link>
          <p className="text-sm text-muted">{franchise.legalName}</p>
        </div>
        <FranchiseStatusBadge status={franchise.status} />
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div><dt className="text-muted">Organization</dt><dd>{franchise.organizationName}</dd></div>
        <div><dt className="text-muted">Territory</dt><dd>{franchise.territoryName ?? '—'}</dd></div>
        <div><dt className="text-muted">Branches</dt><dd className="tabular-nums">{franchise.branchCount}</dd></div>
      </dl>
    </Card>
  )
}

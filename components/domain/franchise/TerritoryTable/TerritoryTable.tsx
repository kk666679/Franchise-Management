'use client'

import { DataTable } from '@/components/data/DataTable'
import { EmptyState } from '@/components/feedback/EmptyState'
import { territoryColumns } from './TerritoryTable.columns'
import type { TerritoryView } from '../mappers'

export function TerritoryTable({ data }: { data: TerritoryView[] }) {
  return (
    <DataTable
      ariaLabel="Territories"
      columns={territoryColumns}
      data={data}
      emptyState={<EmptyState title="No territories" />}
    />
  )
}

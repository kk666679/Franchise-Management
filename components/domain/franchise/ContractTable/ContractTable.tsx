'use client'

import { DataTable } from '@/components/data/DataTable'
import { EmptyState } from '@/components/feedback/EmptyState'
import { contractColumns } from './ContractTable.columns'
import type { ContractView } from '../mappers'

export function ContractTable({ data }: { data: ContractView[] }) {
  return (
    <DataTable
      ariaLabel="Contracts"
      columns={contractColumns}
      data={data}
      emptyState={<EmptyState title="No contracts" />}
    />
  )
}

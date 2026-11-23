'use client'

import { DataTable } from '@/components/data/DataTable'
import { EmptyState } from '@/components/feedback/EmptyState'
import { stockMovementLedgerColumns } from './StockMovementLedger.columns'
import type { StockMovementLedgerProps } from './StockMovementLedger.types'

export function StockMovementLedger({ data, isLoading, emptyState }: StockMovementLedgerProps) {
  return (
    <DataTable
      ariaLabel="Stock movements"
      columns={stockMovementLedgerColumns}
      data={data}
      isLoading={isLoading}
      emptyState={emptyState ?? <EmptyState title="No stock movements" />}
    />
  )
}

'use client'

import { DataTable } from '@/components/data/DataTable'
import { EmptyState } from '@/components/feedback/EmptyState'
import { organizationColumns } from './OrganizationTable.columns'
import type { OrganizationView } from '../mappers'

export function OrganizationTable({ data }: { data: OrganizationView[] }) {
  return (
    <DataTable
      ariaLabel="Organizations"
      columns={organizationColumns}
      data={data}
      emptyState={<EmptyState title="No organizations yet" />}
    />
  )
}

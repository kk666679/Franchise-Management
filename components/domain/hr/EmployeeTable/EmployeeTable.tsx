"use client"

import { DataTable } from "@/components/data/DataTable"
import { EmptyState } from "@/components/feedback/EmptyState"
import { employeeColumns } from "./EmployeeTable.columns"
import type { EmployeeTableProps } from "./EmployeeTable.types"

export function EmployeeTable({
  data,
  isLoading,
  emptyState,
}: EmployeeTableProps) {
  return (
    <DataTable
      ariaLabel="Employees"
      columns={employeeColumns}
      data={data}
      isLoading={isLoading}
      emptyState={emptyState ?? <EmptyState title="No employees" />}
    />
  )
}

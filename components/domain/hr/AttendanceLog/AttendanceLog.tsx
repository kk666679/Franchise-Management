"use client"

import { DataTable } from "@/components/data/DataTable"
import { EmptyState } from "@/components/feedback/EmptyState"
import { attendanceLogColumns } from "./AttendanceLog.columns"
import type { AttendanceLogProps } from "./AttendanceLog.types"

export function AttendanceLog({
  data,
  isLoading,
  emptyState,
}: AttendanceLogProps) {
  return (
    <DataTable
      ariaLabel="Attendance log"
      columns={attendanceLogColumns}
      data={data}
      isLoading={isLoading}
      emptyState={emptyState ?? <EmptyState title="No attendance records" />}
    />
  )
}

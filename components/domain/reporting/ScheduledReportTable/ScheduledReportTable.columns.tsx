"use client"

import { DataTableColumnHeader } from "@/components/data/DataTableColumnHeader"
import type { ScheduledReportView } from "../mappers"

export const scheduledReportColumns = [
  {
    accessorKey: "name",
    header: "Name",
    sortable: true,
  },
  {
    accessorKey: "cadence",
    header: "Cadence",
    sortable: true,
  },
  {
    accessorKey: "recipients",
    header: "Recipients",
    sortable: true,
    cell: (row: ScheduledReportView) => row.recipients.join(", ") || "—",
  },
  {
    accessorKey: "lastRunIso",
    header: "Last run",
    sortable: true,
    cell: (row: ScheduledReportView) =>
      row.lastRunIso ? row.lastRunIso.slice(0, 10) : "—",
  },
  {
    accessorKey: "enabled",
    header: "Enabled",
    sortable: true,
    cell: (row: ScheduledReportView) => (row.enabled ? "Yes" : "No"),
  },
]

"use client"

import { DataTableColumnHeader } from "@/components/data/DataTableColumnHeader"
import type { ComplianceView } from "../mappers"

export const complianceColumns = [
  {
    accessorKey: "title",
    header: "Title",
    sortable: true,
  },
  {
    accessorKey: "category",
    header: "Category",
    sortable: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    sortable: true,
  },
  {
    accessorKey: "ownerName",
    header: "Owner",
    sortable: true,
  },
  {
    accessorKey: "dueDateIso",
    header: "Due",
    sortable: true,
    cell: (row: ComplianceView) =>
      row.dueDateIso ? row.dueDateIso.slice(0, 10) : "—",
  },
]

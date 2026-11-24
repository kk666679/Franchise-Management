"use client"

import Link from "next/link"
import { DataTableColumnHeader } from "@/components/data/DataTableColumnHeader"
import { FormattedDate } from "@/components/common/FormattedDate"
import { FranchiseStatusBadge } from "../FranchiseStatusBadge"
import type { FranchiseView } from "../mappers"

export const franchiseColumns = [
  {
    accessorKey: "name",
    header: "Franchise",
    sortable: true,
    cell: (row: FranchiseView) => (
      <Link
        href={`/franchises/${row.id}`}
        className="font-medium underline-offset-4 hover:underline"
      >
        {row.name}
      </Link>
    ),
  },
  {
    accessorKey: "organizationName",
    header: "Organization",
    sortable: true,
  },
  {
    accessorKey: "territoryName",
    header: "Territory",
    sortable: true,
    cell: (row: FranchiseView) =>
      row.territoryName ?? <span className="text-muted">—</span>,
  },
  {
    accessorKey: "branchCount",
    header: "Branches",
    sortable: true,
    cell: (row: FranchiseView) => (
      <span className="tabular-nums">{row.branchCount}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    sortable: true,
    cell: (row: FranchiseView) => <FranchiseStatusBadge status={row.status} />,
  },
  {
    accessorKey: "createdAtIso",
    header: "Created",
    sortable: true,
    cell: (row: FranchiseView) => <FormattedDate iso={row.createdAtIso} />,
  },
]

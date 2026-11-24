"use client"

import Link from "next/link"
import { FranchiseStatusBadge } from "../FranchiseStatusBadge"
import type { FranchiseView } from "../mappers"

export const franchiseColumns = [
  {
    accessorKey: "name",
    header: "Franchisee",
    sortable: true,
    cell: (row: FranchiseView) => (
      <div>
        <Link
          href={`/dashboard/franchises/${row.id}`}
          className="font-medium underline-offset-4 hover:underline"
        >
          {row.name}
        </Link>
        {row.legalName !== row.name ? (
          <p className="text-xs text-muted-foreground">{row.legalName}</p>
        ) : null}
      </div>
    ),
  },
  {
    accessorKey: "organizationName",
    header: "Brand",
    sortable: true,
  },
  {
    accessorKey: "territoryName",
    header: "Territory",
    sortable: true,
    cell: (row: FranchiseView) =>
      row.territoryName ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "branchCount",
    header: "Locations",
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
    cell: (row: FranchiseView) => row.createdAtIso.slice(0, 10),
  },
]

"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { BranchView } from "../mappers"

export const branchColumns = [
  {
    accessorKey: "name",
    header: "Location",
    sortable: true,
    cell: (row: BranchView) => (
      <div>
        <Link
          href={`/dashboard/locations/${row.id}`}
          className="font-medium underline-offset-4 hover:underline"
        >
          {row.name}
        </Link>
        {row.code ? (
          <p className="font-mono text-xs text-muted-foreground">{row.code}</p>
        ) : null}
      </div>
    ),
  },
  {
    accessorKey: "brandName",
    header: "Brand",
    sortable: true,
    cell: (row: BranchView) => row.brandName ?? "—",
  },
  {
    accessorKey: "franchiseName",
    header: "Franchise",
    sortable: true,
  },
  {
    accessorKey: "city",
    header: "City / region",
    sortable: true,
    cell: (row: BranchView) =>
      [row.city, row.region].filter(Boolean).join(", ") || "—",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    sortable: true,
    cell: (row: BranchView) => (
      <Badge variant={row.isActive ? "default" : "outline"}>
        {row.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
]


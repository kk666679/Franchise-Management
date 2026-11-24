"use client"

import { DataTableColumnHeader } from "@/components/data/DataTableColumnHeader"
import type { RoyaltyView } from "../mappers"

export const royaltyColumns = [
  {
    accessorKey: "franchiseName",
    header: "Franchise",
    sortable: true,
  },
  {
    accessorKey: "periodLabel",
    header: "Period",
    sortable: true,
  },
  {
    accessorKey: "grossSalesCents",
    header: "Gross sales",
    sortable: true,
    cell: (row: RoyaltyView) => (
      <span className="tabular-nums">
        {new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: row.currency,
        }).format(row.grossSalesCents / 100)}
      </span>
    ),
  },
  {
    accessorKey: "royaltyRateBps",
    header: "Rate",
    sortable: true,
    cell: (row: RoyaltyView) => (
      <span className="tabular-nums">
        {(row.royaltyRateBps / 100).toFixed(2)}%
      </span>
    ),
  },
  {
    accessorKey: "royaltyDueCents",
    header: "Royalty due",
    sortable: true,
    cell: (row: RoyaltyView) => (
      <span className="tabular-nums">
        {new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: row.currency,
        }).format(row.royaltyDueCents / 100)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    sortable: true,
  },
]

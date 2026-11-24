"use client"

import { DataTableColumnHeader } from "@/components/data/DataTableColumnHeader"
import type { PurchaseOrderView } from "../mappers"

export const purchaseOrderColumns = [
  {
    accessorKey: "number",
    header: "PO #",
    sortable: true,
  },
  {
    accessorKey: "supplierName",
    header: "Supplier",
    sortable: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    sortable: true,
  },
  {
    accessorKey: "totalCents",
    header: "Total",
    sortable: true,
    cell: (row: PurchaseOrderView) => (
      <span className="tabular-nums">
        {new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: row.currency,
        }).format(row.totalCents / 100)}
      </span>
    ),
  },
  {
    accessorKey: "orderedAtIso",
    header: "Ordered",
    sortable: true,
    cell: (row: PurchaseOrderView) => row.orderedAtIso.slice(0, 10),
  },
]

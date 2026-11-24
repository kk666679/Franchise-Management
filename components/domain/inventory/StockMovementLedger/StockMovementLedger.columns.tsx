"use client"

import { DataTableColumnHeader } from "@/components/data/DataTableColumnHeader"
import type { StockMovementView } from "../mappers"

export const stockMovementLedgerColumns = [
  {
    accessorKey: "productName",
    header: "Product",
    sortable: true,
  },
  {
    accessorKey: "type",
    header: "Type",
    sortable: true,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    sortable: true,
    cell: (row: StockMovementView) => (
      <span className="tabular-nums">{row.quantity}</span>
    ),
  },
  {
    accessorKey: "occurredAtIso",
    header: "When",
    sortable: true,
    cell: (row: StockMovementView) =>
      row.occurredAtIso.slice(0, 16).replace("T", " "),
  },
  {
    accessorKey: "reference",
    header: "Reference",
    sortable: true,
    cell: (row: StockMovementView) => row.reference ?? "—",
  },
]

"use client"

import { DataTableColumnHeader } from "@/components/data/DataTableColumnHeader"
import type { ProductView } from "../mappers"

export const productColumns = [
  {
    accessorKey: "name",
    header: "Product",
    sortable: true,
  },
  {
    accessorKey: "sku",
    header: "SKU",
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
    accessorKey: "unitPriceCents",
    header: "Unit price",
    sortable: true,
    cell: (row: ProductView) => (
      <span className="tabular-nums">
        {new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: row.currency,
        }).format(row.unitPriceCents / 100)}
      </span>
    ),
  },
]

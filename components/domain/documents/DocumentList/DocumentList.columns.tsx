"use client"

import Link from "next/link"
import type { DocumentView } from "../mappers"

export const documentListColumns = [
  {
    accessorKey: "name",
    header: "Document",
    sortable: true,
    cell: (row: DocumentView) => (
      <div>
        <Link href={`/dashboard/documents/${row.id}`} className="font-medium hover:underline underline-offset-4">
          {row.name}
        </Link>
        <p className="text-xs text-muted-foreground">{row.updatedBy}</p>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Type",
    sortable: true,
  },
  {
    accessorKey: "version",
    header: "Version",
    sortable: true,
    cell: (row: DocumentView) => <span className="tabular-nums">v{row.version}</span>,
  },
  {
    accessorKey: "updatedAtIso",
    header: "Updated",
    sortable: true,
    cell: (row: DocumentView) => row.updatedAtIso.slice(0, 10),
  },
  {
    accessorKey: "sizeBytes",
    header: "Size",
    sortable: true,
    cell: (row: DocumentView) => {
      const n = row.sizeBytes
      if (n < 1024) return `${n} B`
      if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
      return `${(n / (1024 * 1024)).toFixed(1)} MB`
    },
  },
]

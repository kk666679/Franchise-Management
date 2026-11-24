"use client"

import Link from "next/link"
import type { InvoiceView } from "../mappers"

const STATUS_CLASS: Record<InvoiceView["status"], string> = {
  draft: "text-muted-foreground",
  issued: "text-blue-600 dark:text-blue-400",
  partially_paid: "text-amber-600 dark:text-amber-400",
  paid: "text-emerald-600 dark:text-emerald-400",
  overdue: "text-red-600 dark:text-red-400",
  void: "text-muted-foreground",
}

export const invoiceColumns = [
  {
    accessorKey: "number",
    header: "Invoice",
    sortable: true,
    cell: (row: InvoiceView) => (
      <Link href={`/dashboard/finance/invoices/${row.id}`} className="font-medium hover:underline underline-offset-4">
        {row.number}
      </Link>
    ),
  },
  {
    accessorKey: "franchiseName",
    header: "Franchisee",
    sortable: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    sortable: true,
    cell: (row: InvoiceView) => (
      <span className={`text-xs font-medium uppercase tracking-wide ${STATUS_CLASS[row.status]}`}>
        {row.status.replace("_", " ")}
      </span>
    ),
  },
  {
    accessorKey: "totalCents",
    header: "Total",
    sortable: true,
    cell: (row: InvoiceView) => (
      <span className="tabular-nums">
        {new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: row.currency,
        }).format(row.totalCents / 100)}
      </span>
    ),
  },
  {
    accessorKey: "amountPaidCents",
    header: "Paid",
    sortable: true,
    cell: (row: InvoiceView) => (
      <span className="tabular-nums">
        {new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: row.currency,
        }).format(row.amountPaidCents / 100)}
      </span>
    ),
  },
  {
    accessorKey: "dueDateIso",
    header: "Due",
    sortable: true,
    cell: (row: InvoiceView) => row.dueDateIso.slice(0, 10),
  },
]

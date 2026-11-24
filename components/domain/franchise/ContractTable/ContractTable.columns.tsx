"use client"

import Link from "next/link"
import { FormattedDate } from "@/components/common/FormattedDate"
import { ContractLifecycleBadge } from "../ContractLifecycleBadge"
import type { ContractStatus } from "../ContractLifecycleBadge"
import type { ContractView } from "../mappers"

export const contractColumns = [
  {
    accessorKey: "franchiseName",
    header: "Franchise",
    sortable: true,
    cell: (row: ContractView) => (
      <Link
        href={`/dashboard/agreements/${row.id}`}
        className="font-medium underline-offset-4 hover:underline"
      >
        {row.franchiseName}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    sortable: true,
    cell: (row: ContractView) => (
      <ContractLifecycleBadge status={row.status as ContractStatus} />
    ),
  },
  {
    accessorKey: "effectiveFromIso",
    header: "Effective from",
    sortable: true,
    cell: (row: ContractView) => <FormattedDate iso={row.effectiveFromIso} />,
  },
  {
    accessorKey: "effectiveToIso",
    header: "Effective to",
    sortable: true,
    cell: (row: ContractView) =>
      row.effectiveToIso ? (
        <FormattedDate iso={row.effectiveToIso} />
      ) : (
        <span className="text-muted-foreground">Open-ended</span>
      ),
  },
  {
    accessorKey: "royaltyRatePct",
    header: "Royalty",
    sortable: true,
    cell: (row: ContractView) => (
      <span className="tabular-nums">{row.royaltyRatePct}%</span>
    ),
  },
]


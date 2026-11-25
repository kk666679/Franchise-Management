"use client"

import Link from "next/link"
import { FormattedDate } from "@/components/common/FormattedDate"
import { ContractLifecycleBadge } from "../ContractLifecycleBadge"
import { toContractStatus } from "../mappers"
import type { ContractView } from "../mappers"

export const contractColumns = [
  {
    accessorKey: "agreementNo",
    header: "Agreement",
    sortable: true,
    cell: (row: ContractView) => (
      <div>
        <Link
          href={`/dashboard/agreements/${row.id}`}
          className="font-medium underline-offset-4 hover:underline"
        >
          {row.agreementNo ?? row.franchiseName}
        </Link>
        {row.agreementNo ? (
          <p className="text-xs text-muted-foreground">{row.franchiseName}</p>
        ) : null}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    sortable: true,
    cell: (row: ContractView) => (
      <ContractLifecycleBadge status={toContractStatus(row.status)} />
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
  {
    accessorKey: "initialFeeCents",
    header: "Initial fee",
    sortable: true,
    cell: (row: ContractView) =>
      row.initialFeeCents === undefined ? (
        <span className="text-muted-foreground">—</span>
      ) : (
        <span className="tabular-nums">
          {new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: row.currency ?? "USD",
          }).format(row.initialFeeCents / 100)}
        </span>
      ),
  },
]


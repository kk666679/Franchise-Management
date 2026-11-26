import Link from "next/link"
import { FormattedDate } from "@/components/common/FormattedDate"
import { OrganizationStatusBadge } from "../OrganizationStatusBadge"
import type { OrganizationView } from "../mappers"
import type { DataColumn } from "@/components/data/DataTable"
import type { OrganizationStatus } from "../OrganizationStatusBadge/OrganizationStatusBadge.types"

export const organizationColumns: DataColumn<OrganizationView>[] = [
  {
    accessorKey: "name",
    header: "Organization",
    cell: (row) => <span className="font-medium">{row.name}</span>,
  },
  {
    accessorKey: "legalName",
    header: "Legal name",
    cell: (row) => row.legalName,
  },
  {
    accessorKey: "franchiseCount",
    header: "Franchises",
    cell: (row) => <span className="tabular-nums">{row.franchiseCount}</span>,
  },
  {
    accessorKey: "branchCount",
    header: "Branches",
    cell: (row) => <span className="tabular-nums">{row.branchCount}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (row) => <OrganizationStatusBadge status={row.status as OrganizationStatus} />,
  },
  {
    accessorKey: "createdAtIso",
    header: "Created",
    cell: (row) => <FormattedDate iso={row.createdAtIso} />,
  },
]

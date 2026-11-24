"use client"

import { DataTableColumnHeader } from "@/components/data/DataTableColumnHeader"
import type { EmployeeView } from "../mappers"

export const employeeColumns = [
  {
    accessorKey: "fullName",
    header: "Name",
    sortable: true,
  },
  {
    accessorKey: "email",
    header: "Email",
    sortable: true,
  },
  {
    accessorKey: "role",
    header: "Role",
    sortable: true,
  },
  {
    accessorKey: "branchName",
    header: "Branch",
    sortable: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    sortable: true,
  },
]

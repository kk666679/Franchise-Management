"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { PermissionGate } from "@/components/auth/PermissionGate"
import type { ContractStatus } from "../ContractLifecycleBadge"

type Transition = {
  action: "submit" | "approve" | "activate" | "renew" | "terminate"
  label: string
  from: ContractStatus[]
  to: ContractStatus
  permission: string
}

const TRANSITIONS: Transition[] = [
  {
    action: "submit",
    label: "Submit for approval",
    from: ["draft"],
    to: "pending_approval",
    permission: "contract.submit",
  },
  {
    action: "approve",
    label: "Approve",
    from: ["pending_approval"],
    to: "active",
    permission: "contract.activate",
  },
  {
    action: "renew",
    label: "Renew",
    from: ["active"],
    to: "renewal",
    permission: "contract.activate",
  },
  {
    action: "terminate",
    label: "Terminate",
    from: ["active", "renewal"],
    to: "terminated",
    permission: "contract.terminate",
  },
]

export function ContractTransitionActions({
  contractId,
  status,
  onTransition,
}: {
  contractId: string
  status: ContractStatus
  onTransition: (action: Transition["action"]) => Promise<void>
}) {
  const [isPending, startTransition] = useTransition()
  const available = TRANSITIONS.filter((t) => t.from.includes(status))
  if (available.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {available.map((t) => (
        <PermissionGate key={t.action} permission={t.permission}>
          <Button
            type="button"
            variant={t.action === "terminate" ? "destructive" : "default"}
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await onTransition(t.action)
              })
            }
            aria-label={`${t.label} (${contractId})`}
          >
            {t.label}
          </Button>
        </PermissionGate>
      ))}
    </div>
  )
}

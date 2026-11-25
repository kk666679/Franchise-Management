import { Badge } from "@/components/ui/badge"
import type { PosRegisterView, PosSessionView } from "../types"

export type PosRegisterStatusProps = {
  register: PosRegisterView
  session?: PosSessionView | null
}

export function PosRegisterStatus({ register, session }: PosRegisterStatusProps) {
  const active = !!session && !session.closedAtIso
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm" aria-label="Register status">
      <span className="font-medium">{register.name}</span>
      {register.branchName ? <span className="text-muted-foreground">{register.branchName}</span> : null}
      <Badge variant={active ? "default" : "outline"}>{active ? "Session open" : "Session closed"}</Badge>
      {session?.cashierName ? <span className="text-muted-foreground">Cashier: {session.cashierName}</span> : null}
    </div>
  )
}

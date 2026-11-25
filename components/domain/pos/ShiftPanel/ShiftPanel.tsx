"use client"

import { RegisterOpenDialog } from "../RegisterOpenDialog"
import { RegisterCloseDialog } from "../RegisterCloseDialog"
import { PosSessionSummary } from "../PosSessionSummary"
import type { PosSessionView } from "../types"

export type ShiftPanelProps = {
  session: PosSessionView | null
  onOpenRegister: (openingFloatCents: number) => Promise<void>
  onCloseRegister: (countedCents: number) => Promise<void>
}

export function ShiftPanel({ session, onOpenRegister, onCloseRegister }: ShiftPanelProps) {
  const active = !!session && !session.closedAtIso
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {!active ? <RegisterOpenDialog onOpenRegister={onOpenRegister} /> : <RegisterCloseDialog onCloseRegister={onCloseRegister} />}
      </div>
      {session ? <PosSessionSummary session={session} /> : null}
    </div>
  )
}

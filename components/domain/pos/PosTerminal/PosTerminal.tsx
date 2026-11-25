"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { PosCart } from "../PosCart"
import { PosProductSearch } from "../PosProductSearch"
import { PosTender } from "../PosTender"
import type { PosTerminalProps } from "./PosTerminal.types"

export function PosTerminal({
  products,
  cart,
  onAdd,
  onQtyChange,
  onRemove,
  onTender,
  disabled = false,
  tenderDisabled = false,
  onFocusSearch,
}: PosTerminalProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const tag = target?.tagName?.toLowerCase()
      const typing = tag === "input" || tag === "textarea" || target?.isContentEditable
      if (e.key === "F2") {
        e.preventDefault()
        const input = rootRef.current?.querySelector<HTMLInputElement>('input[aria-label="Search products"]')
        input?.focus()
        onFocusSearch?.()
        return
      }
      if (typing) return
      if (e.key === "F4" && !disabled && !tenderDisabled && cart.length > 0) {
        e.preventDefault()
        void onTender("cash")
      }
      if (e.key === "F8" && !disabled && !tenderDisabled && cart.length > 0) {
        e.preventDefault()
        void onTender("card")
      }
      if (e.key === "F9" && !disabled && !tenderDisabled && cart.length > 0) {
        e.preventDefault()
        rootRef.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [cart.length, disabled, onFocusSearch, onTender, tenderDisabled])

  return (
    <div ref={rootRef} className="grid gap-4 lg:grid-cols-[1fr_360px]" aria-label="POS terminal">
      <Card className="space-y-4 p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold">Products</h2>
          <p className="text-xs text-muted-foreground">F2 search · F4 cash · F8 card</p>
        </div>
        <PosProductSearch products={products} onSelect={onAdd} disabled={disabled} />
      </Card>
      <div className="space-y-4">
        <PosCart items={cart} onQtyChange={onQtyChange} onRemove={onRemove} />
        <PosTender items={cart} onTender={onTender} disabled={tenderDisabled || disabled} />
      </div>
    </div>
  )
}

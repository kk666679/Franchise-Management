"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Bot, MapPin, RefreshCw, ScanBarcode, Sparkles } from "lucide-react"
import type { UIMessage } from "ai"
import { generateId } from "ai"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation"
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message"
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input"
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion"
import { Shimmer } from "@/components/ai-elements/shimmer"
import { Confirmation, ConfirmationAccepted, ConfirmationAction, ConfirmationActions, ConfirmationRejected, ConfirmationRequest, ConfirmationTitle } from "@/components/ai-elements/confirmation"

import { PosTerminal } from "@/components/domain/pos/PosTerminal"
import { PosReceipt, type PosReceiptView } from "@/components/domain/pos/PosReceipt"
import { ShiftPanel } from "@/components/domain/pos/ShiftPanel"
import { OfflineBanner } from "@/components/domain/pos/OfflineBanner"
import { PosRegisterStatus } from "@/components/domain/pos/PosRegisterStatus"
import { PosSyncStatus } from "@/components/domain/pos/PosSyncStatus"
import { PosKioskToggle } from "@/components/domain/pos/PosKioskToggle"
import { PosEndOfDayReport } from "@/components/domain/pos/PosEndOfDayReport"
import { PosVoidRefundDialog } from "@/components/domain/pos/PosVoidRefundDialog"
import type { PosCartItemView, PosProductView, PosSessionView, PosOutboxEntryView, PosEndOfDayReportView } from "@/components/domain/pos/types"

const LeafletGeoMap = dynamic(() => import("@/app/dashboard/location/_components/map/LeafletGeoMap").then((m) => m.LeafletGeoMap), { ssr: false })

export type PosLocationOption = { id: string; name: string; code: string; status: string; businessStatus?: string | null; addressLine1?: string | null; city?: string | null; state?: string | null; country?: string | null; latitude: number | null; longitude: number | null; brand?: { id: string; name: string } | null; assignedTerritory?: { id: string; name: string; territoryCode: string } | null }
export type PosRegisterOption = { id: string; code: string; name: string; locationId?: string | null; locationName?: string | null; active: boolean; openShift: { id: string; openedAtIso: string; openingFloatCents: number } | null }
type ChatStatus = "idle" | "submitted" | "streaming" | "error"
const POS_SUGGESTIONS = ["Summarize the current cart", "Which items are most expensive?", "Help me close the register"]
function fmtMoney(cents: number, currency: string) { return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100) }

export function PosDashboardClient({ initialLocations, initialRegisters, initialProducts, currency = "USD" }: { initialLocations: PosLocationOption[]; initialRegisters: PosRegisterOption[]; initialProducts: PosProductView[]; currency?: string }) {
  const [locations] = useState(initialLocations)
  const [registers, setRegisters] = useState(initialRegisters)
  const [products, setProducts] = useState(initialProducts)
  const [selectedLocationId, setSelectedLocationId] = useState<string>(initialLocations[0]?.id ?? "")
  const [selectedRegisterId, setSelectedRegisterId] = useState<string>(initialRegisters[0]?.id ?? "")
  const [cart, setCart] = useState<PosCartItemView[]>([])
  const [session, setSession] = useState<PosSessionView | null>(null)
  const [receipt, setReceipt] = useState<PosReceiptView | null>(null)
  const [receiptSeq, setReceiptSeq] = useState(1001)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [offline, setOffline] = useState(false)
  const [outbox, setOutbox] = useState<PosOutboxEntryView[]>([])
  const [pendingTender, setPendingTender] = useState<{ method: "cash" | "card"; totalCents: number } | null>(null)
  const [tenderApproval, setTenderApproval] = useState<{ id: string; approved: boolean; reason?: string } | undefined>(undefined)
  const [tenderState, setTenderState] = useState<"approval-requested" | "approval-responded" | "output-available" | "output-denied">("approval-requested")
  const [kiosk, setKiosk] = useState(false)
  const [newRegisterCode, setNewRegisterCode] = useState("")
  const [newRegisterName, setNewRegisterName] = useState("")
  const [lastReport, setLastReport] = useState<PosEndOfDayReportView | null>(null)
  const [messages, setMessages] = useState<UIMessage[]>([])
  const [input, setInput] = useState("")
  const [chatStatus, setChatStatus] = useState<ChatStatus>("idle")
  const abortRef = useRef<AbortController | null>(null)

  const selectedLocation = locations.find((l) => l.id === selectedLocationId) ?? null
  const registersForLocation = registers.filter((r) => !selectedLocationId || r.locationId === selectedLocationId || !r.locationId)
  const selectedRegister = registers.find((r) => r.id === selectedRegisterId) ?? registersForLocation[0] ?? null

  useEffect(() => { if (selectedRegister && selectedRegister.id !== selectedRegisterId) setSelectedRegisterId(selectedRegister.id) }, [selectedRegister, selectedRegisterId])
  useEffect(() => { const on = () => setOffline(!navigator.onLine); on(); window.addEventListener("online", on); window.addEventListener("offline", on); return () => { window.removeEventListener("online", on); window.removeEventListener("offline", on) } }, [])

  const refreshRegisters = useCallback(async () => {
    const res = await fetch(`/api/pos/registers${selectedLocationId ? `?locationId=${encodeURIComponent(selectedLocationId)}` : ""}`)
    if (!res.ok) return
    const json = await res.json(); setRegisters(json.data ?? [])
  }, [selectedLocationId])
  const refreshProducts = useCallback(async () => {
    const res = await fetch("/api/pos/products"); if (!res.ok) return
    const json = await res.json(); setProducts((json.data ?? []).map((p: any) => ({ ...p, currency })))
  }, [currency])
  useEffect(() => { void refreshRegisters() }, [refreshRegisters])
  useEffect(() => { void refreshProducts() }, [refreshProducts])

  useEffect(() => {
    async function loadActiveShift() {
      if (!selectedRegisterId) { setSession(null); return }
      const res = await fetch(`/api/pos/registers/${selectedRegisterId}/open`)
      if (!res.ok) return
      const json = await res.json(); const shift = json.data
      setSession(shift ? { id: shift.id, registerId: shift.registerId, openedAtIso: shift.openedAtIso, closedAtIso: shift.closedAtIso, openingFloatCents: shift.openingFloatCents, closingTotalCents: shift.closingTotalCents, currency, registerName: shift.registerName } : null)
    }
    void loadActiveShift()
  }, [currency, selectedRegisterId])

  const active = !!session && !session.closedAtIso
  const addProduct = (product: PosProductView) => {
    if (!active) return
    setReceipt(null); setError(null)
    setCart((prev) => { const found = prev.find((l) => l.productId === product.id); if (found) return prev.map((l) => l.productId === product.id ? { ...l, quantity: l.quantity + 1 } : l); return [...prev, { id: crypto.randomUUID(), productId: product.id, name: product.name, quantity: 1, unitPriceCents: product.priceCents, currency: product.currency || currency }] })
  }
  const onQtyChange = (id: string, qty: number) => setCart((prev) => prev.map((l) => l.id === id ? { ...l, quantity: Math.max(1, qty) } : l))
  const onRemove = (id: string) => setCart((prev) => prev.filter((l) => l.id !== id))
  const onTender = async (method: "cash" | "card") => {
    if (cart.length === 0 || !active || submitting) return
    const totalCents = cart.reduce((s, i) => s + i.quantity * i.unitPriceCents, 0)
    setPendingTender({ method, totalCents }); setTenderApproval({ id: crypto.randomUUID(), approved: false }); setTenderState("approval-requested")
  }
  const executeTender = async () => {
    if (!pendingTender || submitting || !selectedRegisterId || !session) return
    const { method, totalCents } = pendingTender; setError(null); setSubmitting(true)
    const receiptNo = `RCP-${selectedRegister?.code ?? "REG"}-${receiptSeq}`; const idempotencyKey = crypto.randomUUID()
    setOutbox((prev) => {
  const newEntry: PosOutboxEntryView = {
    id: crypto.randomUUID(),
    clientOpId: idempotencyKey,
    status: "pending",
    retryCount: 0,
    createdAtIso: new Date().toISOString(),
  };
  return [newEntry, ...prev].slice(0, 20);
})
    try {
      const res = await fetch("/api/pos/sales", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ receiptNo, idempotencyKey, terminalId: selectedRegisterId, shiftId: session.id, lines: cart.map((i) => ({ productId: i.productId, quantity: i.quantity })), payments: [{ method: method === "cash" ? "CASH" : "CARD", amount: (totalCents / 100).toFixed(2) }] }) })
      const json = await res.json().catch(() => null); if (!res.ok) throw new Error(json?.error || `Sale failed (${res.status})`)
      setReceiptSeq((n) => n + 1); setReceipt({ receiptNumber: receiptNo, currency, totalCents, lines: cart.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity, totalCents: i.quantity * i.unitPriceCents })) }); setCart([])
      setTenderApproval((a) => a ? { ...a, approved: true } : undefined); setTenderState("output-available"); setPendingTender(null)
      setOutbox((prev) => prev.map((o) => o.clientOpId === idempotencyKey ? { ...o, status: "synced" } : o))
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to complete sale."; setError(msg)
      setTenderApproval((a) => a ? { ...a, approved: false, reason: msg } : undefined); setTenderState("output-denied"); setPendingTender(null)
      setOutbox((prev) => prev.map((o) => o.clientOpId === idempotencyKey ? { ...o, status: offline ? "pending" : "failed", lastError: msg } : o))
    } finally { setSubmitting(false) }
  }

  const onOpenRegister = async (openingFloatCents: number) => {
    if (!selectedRegisterId) return; setError(null)
    const res = await fetch(`/api/pos/registers/${selectedRegisterId}/open`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ openingFloatCents }) })
    const json = await res.json().catch(() => null); if (!res.ok) { setError(json?.error ?? "Failed to open register"); return }
    const shift = json.data; setSession({ id: shift.id, registerId: shift.registerId, openedAtIso: shift.openedAtIso, closedAtIso: null, openingFloatCents: shift.openingFloatCents, closingTotalCents: null, currency, registerName: shift.registerName })
    setLastReport(null); setReceipt(null); await refreshRegisters()
  }
  const onCloseRegister = async (countedCents: number) => {
    if (!selectedRegisterId || !session) return; setError(null)
    const res = await fetch(`/api/pos/registers/${selectedRegisterId}/close`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ shiftId: session.id, countedCashCents: countedCents }) })
    const json = await res.json().catch(() => null); if (!res.ok) { setError(json?.error ?? "Failed to close register"); return }
    const shift = json.data; setSession({ id: shift.id, registerId: shift.registerId, openedAtIso: shift.openedAtIso, closedAtIso: shift.closedAtIso, openingFloatCents: shift.openingFloatCents, closingTotalCents: shift.closingTotalCents, currency, registerName: shift.registerName })
    setCart([]); setLastReport({ registerId: shift.registerId, registerName: shift.registerName ?? selectedRegister?.name ?? "Register", openedAtIso: shift.openedAtIso, closedAtIso: shift.closedAtIso ?? new Date().toISOString(), openingFloatCents: shift.openingFloatCents, cashSalesCents: Math.max(0, (shift.expectedCashCents ?? shift.openingFloatCents) - shift.openingFloatCents), cardSalesCents: 0, otherSalesCents: 0, refundsCents: 0, expectedCashCents: shift.expectedCashCents ?? shift.openingFloatCents, countedCashCents: shift.closingTotalCents ?? countedCents, varianceCents: shift.varianceCents ?? 0, currency }); await refreshRegisters()
  }
  const createRegister = async () => {
    if (!newRegisterCode.trim() || !newRegisterName.trim()) return; setError(null)
    const res = await fetch("/api/pos/registers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locationId: selectedLocationId || null, code: newRegisterCode.trim(), name: newRegisterName.trim() }) })
    const json = await res.json().catch(() => null); if (!res.ok) { setError(json?.error ?? "Failed to create register"); return }
    setNewRegisterCode(""); setNewRegisterName(""); await refreshRegisters(); if (json.data?.id) setSelectedRegisterId(json.data.id)
  }

  const cartContext = useMemo(() => { const total = cart.reduce((s, i) => s + i.quantity * i.unitPriceCents, 0); return `POS context: location ${selectedLocation?.name ?? "none"}, register ${selectedRegister?.name ?? "none"}, shift ${active ? "open" : "closed"}, cart items ${cart.length}, cart total ${fmtMoney(total, currency)}.` }, [active, cart, currency, selectedLocation?.name, selectedRegister?.name])
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || chatStatus === "submitted" || chatStatus === "streaming") return
    const userMsg: UIMessage = { id: generateId(), role: "user", parts: [{ type: "text", text }] }; const nextMessages = [...messages, userMsg]; setMessages(nextMessages); setInput(""); setChatStatus("submitted")
    const controller = new AbortController(); abortRef.current = controller
    try {
      const res = await fetch("/api/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ id: "ctx", role: "user", parts: [{ type: "text", text: cartContext }] }, ...nextMessages] }), signal: controller.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`); const assistantId = generateId(); let accumulated = ""; setChatStatus("streaming"); setMessages((prev) => [...prev, { id: assistantId, role: "assistant", parts: [{ type: "text", text: "" }] }])
      const reader = res.body?.getReader(); const decoder = new TextDecoder(); if (reader) { while (true) { const { done, value } = await reader.read(); if (done) break; accumulated += decoder.decode(value, { stream: true }); setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, parts: [{ type: "text", text: accumulated }] } : m)) } }
      setChatStatus("idle")
    } catch (err) { if ((err as Error).name !== "AbortError") setChatStatus("error"); else setChatStatus("idle") }
  }, [cartContext, chatStatus, messages])
  const stop = useCallback(() => { abortRef.current?.abort(); setChatStatus("idle") }, [])

  const mapLocations = locations.filter((l) => l.latitude != null && l.longitude != null).map((l) => ({ id: l.id, name: l.name, code: l.code, locationType: "FRANCHISE_OUTLET" as const, status: l.status, businessStatus: l.businessStatus, latitude: l.latitude, longitude: l.longitude, addressLine1: l.addressLine1, city: l.city, state: l.state, country: l.country, brand: l.brand ?? null, franchisee: null, assignedTerritory: l.assignedTerritory ?? null }))

  return (
    <div className={kiosk ? "fixed inset-0 z-50 overflow-auto bg-background p-4" : "space-y-6"}>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <ScanBarcode className="size-5 text-muted-foreground" aria-hidden="true" />
            <h1 className="text-xl font-semibold">Point of sale</h1>
            {selectedRegister ? <PosRegisterStatus register={{ id: selectedRegister.id, name: selectedRegister.name, branchName: selectedLocation?.name ?? selectedRegister.locationName, status: active ? "open" : "closed" }} session={session} /> : null}
          </div>
          <p className="text-sm text-muted-foreground">Location-aware POS with real register, shift, and sale persistence.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => { void refreshRegisters(); void refreshProducts() }}><RefreshCw className="size-4" />Refresh</Button>
          <PosKioskToggle active={kiosk} onToggle={setKiosk} />
        </div>
      </div>

      <OfflineBanner offline={offline} pendingCount={outbox.filter((o) => o.status === "pending" || o.status === "failed").length} />

      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <Card className="border-border/60">
          <CardHeader className="pb-3"><CardTitle className="text-base">Location & Register</CardTitle><CardDescription>Select the operating location and register.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5"><Label>Location</Label><Select value={selectedLocationId} onValueChange={setSelectedLocationId}><SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger><SelectContent>{locations.map((l) => <SelectItem key={l.id} value={l.id}>{l.name} ({l.code})</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-1.5"><Label>Register</Label><Select value={selectedRegisterId} onValueChange={setSelectedRegisterId}><SelectTrigger><SelectValue placeholder="Select register" /></SelectTrigger><SelectContent>{registersForLocation.map((r) => <SelectItem key={r.id} value={r.id}>{r.name} ({r.code})</SelectItem>)}</SelectContent></Select></div>
            <div className="rounded-md border border-border p-3 space-y-2"><p className="text-sm font-medium">Create register</p><Input placeholder="Code (e.g. REG-01)" value={newRegisterCode} onChange={(e) => setNewRegisterCode(e.target.value)} /><Input placeholder="Name (e.g. Front Counter)" value={newRegisterName} onChange={(e) => setNewRegisterName(e.target.value)} /><Button size="sm" variant="outline" onClick={() => void createRegister()} disabled={!newRegisterCode.trim() || !newRegisterName.trim()}>Create register</Button></div>
            {selectedLocation ? <div className="rounded-md border border-border p-3 text-sm space-y-1"><div className="flex items-center gap-2 font-medium"><MapPin className="size-4" />{selectedLocation.name}</div><div className="text-muted-foreground">{[selectedLocation.addressLine1, selectedLocation.city, selectedLocation.state, selectedLocation.country].filter(Boolean).join(", ") || "No address"}</div><div className="flex gap-2 flex-wrap"><Badge variant="outline">{selectedLocation.status}</Badge>{selectedLocation.assignedTerritory ? <Badge variant="secondary">{selectedLocation.assignedTerritory.name}</Badge> : null}</div></div> : null}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Tabs defaultValue="terminal" className="space-y-4">
            <TabsList><TabsTrigger value="terminal">Terminal</TabsTrigger><TabsTrigger value="location">Location map</TabsTrigger><TabsTrigger value="sync">Sync / Report</TabsTrigger></TabsList>
            <TabsContent value="terminal" className="space-y-4 mt-0">
              <PosTerminal products={products} cart={cart} onAdd={addProduct} onQtyChange={onQtyChange} onRemove={onRemove} onTender={onTender} disabled={!active} tenderDisabled={submitting} />
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div className="space-y-4">
                  <ShiftPanel session={session} onOpenRegister={onOpenRegister} onCloseRegister={onCloseRegister} />
                  {pendingTender ? <Confirmation approval={tenderApproval} state={tenderState} className="border-border/60 bg-card"><ConfirmationTitle>Confirm {pendingTender.method} payment of {fmtMoney(pendingTender.totalCents, currency)}?</ConfirmationTitle><ConfirmationRequest><ConfirmationActions><ConfirmationAction variant="outline" onClick={() => { setTenderApproval((a) => a ? { ...a, approved: false, reason: "Cancelled" } : undefined); setTenderState("output-denied"); setPendingTender(null) }}>Cancel</ConfirmationAction><ConfirmationAction onClick={() => void executeTender()} disabled={submitting}>Confirm sale</ConfirmationAction></ConfirmationActions></ConfirmationRequest><ConfirmationAccepted>Payment processed.</ConfirmationAccepted><ConfirmationRejected>Payment cancelled.</ConfirmationRejected></Confirmation> : null}
                  {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
                  {receipt ? <div className="space-y-2"><PosReceipt receipt={receipt} /><PosVoidRefundDialog mode="refund" receiptNumber={receipt.receiptNumber} onConfirm={async () => {}} disabled /></div> : null}
                  {lastReport ? <PosEndOfDayReport report={lastReport} /> : null}
                </div>
                <Card className="flex min-h-[420px] flex-col border-border/60 shadow-sm">
                  <CardHeader className="pb-3"><div className="flex items-center gap-2"><div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Bot className="size-4" aria-hidden="true" /></div><div><CardTitle className="text-base">POS Assistant</CardTitle><CardDescription>Ask for help with products, cart, or register.</CardDescription></div></div></CardHeader>
                  <CardContent className="flex min-h-0 flex-1 flex-col p-0">
                    <Conversation className="min-h-0 flex-1"><ConversationContent className="px-4">{messages.length === 0 ? <div className="space-y-4 py-6"><div className="flex items-center gap-2 text-sm text-muted-foreground"><Sparkles className="size-4" aria-hidden="true" /><Shimmer as="span" duration={2.5}>How can I help with this sale?</Shimmer></div><Suggestions>{POS_SUGGESTIONS.map((s) => <Suggestion key={s} suggestion={s} onClick={(v) => setInput(v)} />)}</Suggestions></div> : messages.map((msg) => <Message key={msg.id} from={msg.role}><MessageContent>{msg.parts.map((part, i) => part.type === "text" ? <MessageResponse key={i}>{part.text}</MessageResponse> : null)}</MessageContent></Message>)}</ConversationContent><ConversationScrollButton /></Conversation>
                    <div className="border-t border-border/60 p-3"><PromptInput onSubmit={() => sendMessage(input)}><PromptInputTextarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask POS assistantâ€¦" /><PromptInputFooter><span className="text-[11px] text-muted-foreground">AI can make mistakes. Verify before acting.</span><PromptInputSubmit status={chatStatus === "idle" ? undefined : chatStatus} onStop={stop} /></PromptInputFooter></PromptInput></div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="location" className="mt-0 space-y-4">
              <Card className="border-border/60"><CardHeader className="pb-3"><CardTitle className="text-base">Location map</CardTitle><CardDescription>Franchise locations from the geospatial module. Select a location to scope POS registers.</CardDescription></CardHeader><CardContent><LeafletGeoMap locations={mapLocations as any} territories={[]} selectedLocationId={selectedLocationId} onSelectLocation={(id) => setSelectedLocationId(id)} height="560px" /></CardContent></Card>
            </TabsContent>
            <TabsContent value="sync" className="mt-0 space-y-4">
              <PosSyncStatus entries={outbox} />
              {lastReport ? <PosEndOfDayReport report={lastReport} /> : <Card className="p-4 text-sm text-muted-foreground">Close a shift to generate a Z-report.</Card>}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

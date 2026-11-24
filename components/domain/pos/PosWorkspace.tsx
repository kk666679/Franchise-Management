"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import type { UIMessage } from "ai"
import { generateId } from "ai"
import { Bot, ScanBarcode, Sparkles } from "lucide-react"

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message"
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input"
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion"
import { Shimmer } from "@/components/ai-elements/shimmer"
import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRejected,
  ConfirmationRequest,
  ConfirmationTitle,
} from "@/components/ai-elements/confirmation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PosReceipt, type PosReceiptView } from "./PosReceipt"
import { PosSessionSummary } from "./PosSessionSummary"
import { PosTerminal } from "./PosTerminal"
import { RegisterCloseDialog } from "./RegisterCloseDialog"
import { RegisterOpenDialog } from "./RegisterOpenDialog"
import type { PosCartItemView, PosProductView, PosSessionView } from "./mappers"

type PosWorkspaceProps = {
  products: PosProductView[]
  currency?: string
}

type ChatStatus = "idle" | "submitted" | "streaming" | "error"

const POS_SUGGESTIONS = [
  "Summarize the current cart",
  "Which items are most expensive?",
  "Help me close the register",
]

function nowIso() {
  return new Date().toISOString()
}

export function PosWorkspace({ products, currency = "USD" }: PosWorkspaceProps) {
  const [cart, setCart] = useState<PosCartItemView[]>([])
  const [session, setSession] = useState<PosSessionView | null>(null)
  const [receipt, setReceipt] = useState<PosReceiptView | null>(null)
  const [receiptSeq, setReceiptSeq] = useState(1001)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [pendingTender, setPendingTender] = useState<{ method: "cash" | "card"; totalCents: number } | null>(null)
  const [tenderApproval, setTenderApproval] = useState<{ id: string; approved: boolean; reason?: string } | undefined>(undefined)
  const [tenderState, setTenderState] = useState<"approval-requested" | "approval-responded" | "output-available" | "output-denied">("approval-requested")

  const [messages, setMessages] = useState<UIMessage[]>([])
  const [input, setInput] = useState("")
  const [chatStatus, setChatStatus] = useState<ChatStatus>("idle")
  const abortRef = useRef<AbortController | null>(null)

  const active = !!session && !session.closedAtIso

  const addProduct = (product: PosProductView) => {
    if (!active) return
    setReceipt(null)
    setError(null)
    setCart((prev) => {
      const found = prev.find((l) => l.productId === product.id)
      if (found) return prev.map((l) => l.productId === product.id ? { ...l, quantity: l.quantity + 1 } : l)
      return [...prev, {
        id: crypto.randomUUID(),
        productId: product.id,
        name: product.name,
        quantity: 1,
        unitPriceCents: product.priceCents,
        currency: product.currency || currency,
      }]
    })
  }

  const onQtyChange = (id: string, qty: number) => {
    setCart((prev) => prev.map((l) => l.id === id ? { ...l, quantity: Math.max(1, qty) } : l))
  }
  const onRemove = (id: string) => setCart((prev) => prev.filter((l) => l.id !== id))

  const onTender = async (method: "cash" | "card") => {
    if (cart.length === 0 || !active || submitting) return
    const totalCents = cart.reduce((s, i) => s + i.quantity * i.unitPriceCents, 0)
    setPendingTender({ method, totalCents })
    setTenderApproval({ id: crypto.randomUUID() })
    setTenderState("approval-requested")
  }

  const executeTender = async () => {
    if (!pendingTender || submitting) return
    const { method, totalCents } = pendingTender
    setError(null)
    setSubmitting(true)
    const receiptNo = `RCP-${receiptSeq}`
    const idempotencyKey = crypto.randomUUID()
    try {
      const res = await fetch("/api/pos/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiptNo,
          idempotencyKey,
          lines: cart.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          payments: [{ method: method === "cash" ? "CASH" : "CARD", amount: (totalCents / 100).toFixed(2) }],
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || `Sale failed (${res.status})`)
      }
      setReceiptSeq((n) => n + 1)
      setReceipt({
        receiptNumber: receiptNo,
        currency,
        totalCents,
        lines: cart.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity, totalCents: i.quantity * i.unitPriceCents })),
      })
      setCart([])
      setTenderApproval((a) => a ? { ...a, approved: true } : undefined)
      setTenderState("output-available")
      setPendingTender(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to complete sale.")
      setTenderApproval((a) => a ? { ...a, approved: false, reason: "Sale failed" } : undefined)
      setTenderState("output-denied")
      setPendingTender(null)
    } finally {
      setSubmitting(false)
    }
  }

  const onOpenRegister = async (openingFloatCents: number) => {
    setSession({
      id: crypto.randomUUID(),
      registerId: "REG-01",
      openedAtIso: nowIso(),
      closedAtIso: null,
      openingFloatCents,
      closingTotalCents: null,
      currency,
    })
    setReceipt(null)
    setError(null)
    setPendingTender(null)
    setTenderApproval(undefined)
    setTenderState("approval-requested")
  }

  const onCloseRegister = async (countedCents: number) => {
    setSession((prev) => prev ? { ...prev, closedAtIso: nowIso(), closingTotalCents: countedCents } : prev)
    setCart([])
    setPendingTender(null)
  }

  const cartContext = useMemo(() => {
    const total = cart.reduce((s, i) => s + i.quantity * i.unitPriceCents, 0)
    return `POS context: register ${active ? "open" : "closed"}, cart items ${cart.length}, cart total ${(total / 100).toFixed(2)} ${currency}. Products available: ${products.slice(0, 20).map((p) => p.name).join(", ")}.`
  }, [active, cart, currency, products])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || chatStatus === "submitted" || chatStatus === "streaming") return
    const userMsg: UIMessage = { id: generateId(), role: "user", parts: [{ type: "text", text }] }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput("")
    setChatStatus("submitted")
    const controller = new AbortController()
    abortRef.current = controller
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { id: "ctx", role: "user", parts: [{ type: "text", text: cartContext }] },
            ...nextMessages,
          ],
        }),
        signal: controller.signal,
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const assistantId = generateId()
      let accumulated = ""
      setChatStatus("streaming")
      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", parts: [{ type: "text", text: "" }] }])
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          accumulated += decoder.decode(value, { stream: true })
          setMessages((prev) => prev.map((m) => m.id === assistantId ? { ...m, parts: [{ type: "text", text: accumulated }] } : m))
        }
      }
      setChatStatus("idle")
    } catch (err) {
      if ((err as Error).name !== "AbortError") setChatStatus("error")
      else setChatStatus("idle")
    }
  }, [cartContext, chatStatus, messages])

  const stop = useCallback(() => {
    abortRef.current?.abort()
    setChatStatus("idle")
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-muted-foreground">
            <ScanBarcode className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium">Register REG-01</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{active ? "Session open" : "Session closed"}</span>
              <Badge variant="outline" className={active ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : ""}>
                {active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!active ? <RegisterOpenDialog onOpenRegister={onOpenRegister} /> : <RegisterCloseDialog onCloseRegister={onCloseRegister} />}
        </div>
      </div>

      {!active ? (
        <Card className="border-dashed border-border/60 bg-muted/20 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Register closed</CardTitle>
            <CardDescription>Open a register session to start processing sales.</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <PosTerminal
        products={products}
        cart={cart}
        onAdd={addProduct}
        onQtyChange={onQtyChange}
        onRemove={onRemove}
        onTender={onTender}
        disabled={!active}
        tenderDisabled={submitting}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          {pendingTender ? (
            <Confirmation approval={tenderApproval} state={tenderState} className="border-border/60 bg-card">
              <ConfirmationTitle>
                Confirm {pendingTender.method} payment of {new Intl.NumberFormat("en-US", { style: "currency", currency }).format(pendingTender.totalCents / 100)}?
              </ConfirmationTitle>
              <ConfirmationRequest>
                <ConfirmationActions>
                  <ConfirmationAction variant="outline" onClick={() => { setTenderApproval((a) => a ? { ...a, approved: false, reason: "Cancelled by cashier" } : undefined); setTenderState("output-denied"); setPendingTender(null) }}>Cancel</ConfirmationAction>
                  <ConfirmationAction onClick={() => void executeTender()} disabled={submitting}>Confirm sale</ConfirmationAction>
                </ConfirmationActions>
              </ConfirmationRequest>
              <ConfirmationAccepted>Payment approved and processed.</ConfirmationAccepted>
              <ConfirmationRejected>Payment cancelled.</ConfirmationRejected>
            </Confirmation>
          ) : null}
          {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
          {receipt ? <PosReceipt receipt={receipt} /> : null}
          {session ? <PosSessionSummary session={session} /> : null}
        </div>

        <Card className="flex min-h-[420px] flex-col border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Bot className="size-4" aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-base">POS Assistant</CardTitle>
                <CardDescription>Ask for help with products, cart, or register.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col p-0">
            <Conversation className="min-h-0 flex-1">
              <ConversationContent className="px-4">
                {messages.length === 0 ? (
                  <div className="space-y-4 py-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Sparkles className="size-4" aria-hidden="true" />
                      <Shimmer as="span" duration={2.5}>How can I help with this sale?</Shimmer>
                    </div>
                    <Suggestions>
                      {POS_SUGGESTIONS.map((s) => (
                        <Suggestion key={s} suggestion={s} onClick={(v) => setInput(v)} />
                      ))}
                    </Suggestions>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <Message key={msg.id} from={msg.role}>
                      <MessageContent>
                        {msg.parts.map((part, i) => part.type === "text" ? <MessageResponse key={i}>{part.text}</MessageResponse> : null)}
                      </MessageContent>
                    </Message>
                  ))
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
            <div className="border-t border-border/60 p-3">
              <PromptInput onSubmit={() => sendMessage(input)}>
                <PromptInputTextarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask POS assistant…" />
                <PromptInputFooter>
                  <span className="text-[11px] text-muted-foreground">AI can make mistakes. Verify before acting.</span>
                  <PromptInputSubmit status={chatStatus === "idle" ? undefined : chatStatus} onStop={stop} />
                </PromptInputFooter>
              </PromptInput>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

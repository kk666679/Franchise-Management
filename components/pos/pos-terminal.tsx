"use client"

import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Product = {
  id: string
  sku: string
  barcode: string | null
  name: string
  unitPrice: string
  taxRate: string
}

type CartLine = Product & { quantity: number; discount: number }
type Payment = { method: "CASH" | "CARD" | "BANK_TRANSFER"; amount: string }

const money = (value: number) => value.toFixed(2)

export function POSTerminal() {
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartLine[]>([])
  const [payments, setPayments] = useState<Payment[]>([
    { method: "CASH", amount: "" },
  ])
  const [receipt, setReceipt] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const totals = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, line) => sum + Number(line.unitPrice) * line.quantity,
      0
    )
    const discount = cart.reduce((sum, line) => sum + line.discount, 0)
    const tax = cart.reduce(
      (sum, line) =>
        sum +
        ((Number(line.unitPrice) * line.quantity - line.discount) *
          Number(line.taxRate)) /
          100,
      0
    )
    return { subtotal, discount, tax, total: subtotal - discount + tax }
  }, [cart])

  async function search() {
    setError(null)
    const response = await fetch(
      `/api/pos/products?q=${encodeURIComponent(query)}`
    )
    if (!response.ok) {
      setError("Unable to search products.")
      return
    }
    setProducts(await response.json())
  }

  function addProduct(product: Product) {
    setCart((current) => {
      const existing = current.find((line) => line.id === product.id)
      if (existing) {
        return current.map((line) =>
          line.id === product.id
            ? { ...line, quantity: line.quantity + 1 }
            : line
        )
      }
      return [...current, { ...product, quantity: 1, discount: 0 }]
    })
  }

  async function completeSale() {
    setBusy(true)
    setError(null)
    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiptNo: `POS-${Date.now()}`,
          idempotencyKey: crypto.randomUUID(),
          lines: cart.map((line) => ({
            productId: line.id,
            quantity: line.quantity,
            discount: line.discount,
          })),
          payments: payments.filter((payment) => Number(payment.amount) > 0),
        }),
      })
      const body = await response.json()
      if (!response.ok)
        throw new Error(body.error ?? "Unable to complete sale.")
      setReceipt(body)
      setCart([])
      setPayments([{ method: "CASH", amount: "" }])
    } catch (saleError) {
      setError(
        saleError instanceof Error
          ? saleError.message
          : "Unable to complete sale."
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
      <section className="space-y-4 rounded-2xl border bg-card p-5">
        <div className="flex gap-2">
          <Input
            aria-label="Search products"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && search()}
            placeholder="Search by name, SKU, or barcode"
            value={query}
          />
          <Button onClick={search}>Search</Button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {products.map((product) => (
            <button
              className="rounded-xl border p-3 text-left transition hover:bg-muted"
              key={product.id}
              onClick={() => addProduct(product)}
              type="button"
            >
              <p className="font-medium">{product.name}</p>
              <p className="text-xs text-muted-foreground">
                {product.sku} · {product.unitPrice}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Cart</h2>
          <span className="text-sm text-muted-foreground">
            {cart.length} items
          </span>
        </div>
        {cart.map((line) => (
          <div className="grid grid-cols-[1fr_auto_auto] gap-3" key={line.id}>
            <div>
              <p className="font-medium">{line.name}</p>
              <p className="text-xs text-muted-foreground">
                {line.quantity} × {line.unitPrice}
              </p>
            </div>
            <Input
              aria-label={`Discount for ${line.name}`}
              className="w-24"
              min="0"
              onChange={(event) =>
                setCart((current) =>
                  current.map((item) =>
                    item.id === line.id
                      ? { ...item, discount: Number(event.target.value) || 0 }
                      : item
                  )
                )
              }
              type="number"
              value={line.discount}
            />
            <Button
              onClick={() =>
                setCart((current) =>
                  current.filter((item) => item.id !== line.id)
                )
              }
              size="sm"
              variant="ghost"
            >
              Remove
            </Button>
          </div>
        ))}
        <div className="space-y-1 border-t pt-4 text-sm">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>{money(totals.subtotal)}</span>
          </p>
          <p className="flex justify-between">
            <span>Discount</span>
            <span>-{money(totals.discount)}</span>
          </p>
          <p className="flex justify-between">
            <span>Tax</span>
            <span>{money(totals.tax)}</span>
          </p>
          <p className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{money(totals.total)}</span>
          </p>
        </div>
        <div className="space-y-2">
          {payments.map((payment, index) => (
            <div className="flex gap-2" key={index}>
              <select
                aria-label="Payment method"
                className="h-9 rounded-md border bg-background px-2 text-sm"
                onChange={(event) =>
                  setPayments((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index
                        ? {
                            ...item,
                            method: event.target.value as Payment["method"],
                          }
                        : item
                    )
                  )
                }
                value={payment.method}
              >
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="BANK_TRANSFER">Bank transfer</option>
              </select>
              <Input
                aria-label="Payment amount"
                onChange={(event) =>
                  setPayments((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, amount: event.target.value }
                        : item
                    )
                  )
                }
                placeholder="Amount"
                type="number"
                value={payment.amount}
              />
            </div>
          ))}
          <Button
            onClick={() =>
              setPayments((current) => [
                ...current,
                { method: "CASH", amount: "" },
              ])
            }
            size="sm"
            variant="outline"
          >
            Add split payment
          </Button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          className="w-full"
          disabled={busy || cart.length === 0}
          onClick={completeSale}
        >
          {busy ? "Processing…" : "Complete sale"}
        </Button>
      </section>

      {receipt && (
        <section className="rounded-2xl border bg-card p-5 print:border-0">
          <h2 className="font-semibold">Receipt generated</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Receipt {String(receipt.receiptNo)}
          </p>
          <p className="text-xl font-semibold">Total {String(receipt.total)}</p>
          <Button
            className="mt-4"
            onClick={() => window.print()}
            variant="outline"
          >
            Print receipt
          </Button>
        </section>
      )}
    </div>
  )
}

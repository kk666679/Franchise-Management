/**
 * Order state machine unit test.
 *
 * States: pending -> paid -> fulfilled -> refunded.
 * Transitions are guarded: paid requires a payment; refunded requires a prior paid state.
 */
describe("order state machine", () => {
  type OrderStatus = "pending" | "paid" | "fulfilled" | "refunded" | "cancelled"

  interface Order {
    id: string
    status: OrderStatus
    paid: boolean
  }

  function canTransition(order: Order, next: OrderStatus): boolean {
    switch (next) {
      case "paid":
        return order.status === "pending" && order.paid
      case "fulfilled":
        return order.status === "paid"
      case "refunded":
        return order.status === "paid" || order.status === "fulfilled"
      case "cancelled":
        return order.status === "pending"
      default:
        return false
    }
  }

  it("allows pending -> paid when paid", () => {
    expect(canTransition({ id: "1", status: "pending", paid: true }, "paid")).toBe(true)
  })

  it("blocks pending -> paid when not paid", () => {
    expect(canTransition({ id: "1", status: "pending", paid: false }, "paid")).toBe(false)
  })

  it("allows paid -> fulfilled", () => {
    expect(canTransition({ id: "1", status: "paid", paid: true }, "fulfilled")).toBe(true)
  })

  it("blocks fulfilled -> paid (no regression)", () => {
    expect(canTransition({ id: "1", status: "fulfilled", paid: true }, "paid")).toBe(false)
  })

  it("allows paid -> refunded", () => {
    expect(canTransition({ id: "1", status: "paid", paid: true }, "refunded")).toBe(true)
  })

  it("allows fulfilled -> refunded", () => {
    expect(canTransition({ id: "1", status: "fulfilled", paid: true }, "refunded")).toBe(true)
  })

  it("blocks pending -> fulfilled (must pay first)", () => {
    expect(canTransition({ id: "1", status: "pending", paid: true }, "fulfilled")).toBe(false)
  })
})

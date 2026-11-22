import { describe, expect, it } from "vitest"

import { assertPaymentTotal, calculateSaleTotals } from "@/lib/sales-validation"

describe("sales calculations", () => {
  it("calculates tax, discounts, and totals with decimal arithmetic", () => {
    const result = calculateSaleTotals([
      {
        productId: "p1",
        description: "Product",
        quantity: "2",
        unitPrice: "10.00",
        discount: "1.00",
        taxRate: "10",
      },
    ])

    expect(result.subtotal.toFixed(2)).toBe("20.00")
    expect(result.discount.toFixed(2)).toBe("1.00")
    expect(result.tax.toFixed(2)).toBe("1.90")
    expect(result.total.toFixed(2)).toBe("20.90")
  })

  it("requires split payments to equal the sale total", () => {
    const result = calculateSaleTotals([
      {
        productId: "p1",
        description: "Product",
        quantity: 1,
        unitPrice: 12.5,
        taxRate: 0,
      },
    ])

    expect(() =>
      assertPaymentTotal([{ amount: 10 }, { amount: 2 }], result.total)
    ).toThrow("Split payments must equal the sale total.")
    expect(() =>
      assertPaymentTotal([{ amount: 10 }, { amount: 2.5 }], result.total)
    ).not.toThrow()
  })

  it("rejects invalid quantities and excessive discounts", () => {
    expect(() =>
      calculateSaleTotals([
        {
          productId: "p1",
          description: "Product",
          quantity: 0,
          unitPrice: 10,
          taxRate: 0,
        },
      ])
    ).toThrow("Sale quantity must be positive.")

    expect(() =>
      calculateSaleTotals([
        {
          productId: "p1",
          description: "Product",
          quantity: 1,
          unitPrice: 10,
          discount: 11,
          taxRate: 0,
        },
      ])
    ).toThrow("A line discount cannot exceed its gross amount.")
  })
})

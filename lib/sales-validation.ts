import { Prisma } from "@prisma/client"

export type SaleLineCalculation = {
  productId: string
  description: string
  quantity: string | number
  unitPrice: string | number | Prisma.Decimal
  taxRate: string | number | Prisma.Decimal
  discount?: string | number | Prisma.Decimal
}

export type CalculatedSaleLine = {
  productId: string
  description: string
  quantity: Prisma.Decimal
  unitPrice: Prisma.Decimal
  discount: Prisma.Decimal
  tax: Prisma.Decimal
  total: Prisma.Decimal
}

const money = (value: string | number | Prisma.Decimal) =>
  new Prisma.Decimal(value).toDecimalPlaces(2)

export function calculateSaleTotals(lines: SaleLineCalculation[]) {
  if (lines.length === 0)
    throw new Error("A sale must contain at least one line.")

  const calculated: CalculatedSaleLine[] = lines.map((line) => {
    const quantity = new Prisma.Decimal(line.quantity)
    const unitPrice = money(line.unitPrice)
    const discount = money(line.discount ?? 0)
    const taxRate = new Prisma.Decimal(line.taxRate)

    if (!quantity.gt(0)) throw new Error("Sale quantity must be positive.")
    if (unitPrice.lt(0) || discount.lt(0) || taxRate.lt(0)) {
      throw new Error(
        "Sale prices, discounts, and tax rates cannot be negative."
      )
    }
    if (discount.gt(unitPrice.mul(quantity))) {
      throw new Error("A line discount cannot exceed its gross amount.")
    }

    const net = unitPrice.mul(quantity).minus(discount)
    const tax = money(net.mul(taxRate).div(100))
    return {
      productId: line.productId,
      description: line.description,
      quantity,
      unitPrice,
      discount,
      tax,
      total: money(net.plus(tax)),
    }
  })

  const subtotal = money(
    calculated.reduce(
      (sum, line) => sum.plus(line.quantity.mul(line.unitPrice)),
      new Prisma.Decimal(0)
    )
  )
  const discount = money(
    calculated.reduce(
      (sum, line) => sum.plus(line.discount),
      new Prisma.Decimal(0)
    )
  )
  const tax = money(
    calculated.reduce((sum, line) => sum.plus(line.tax), new Prisma.Decimal(0))
  )
  const total = money(subtotal.minus(discount).plus(tax))

  return { lines: calculated, subtotal, discount, tax, total }
}

export function assertPaymentTotal(
  payments: Array<{ amount: string | number }>,
  total: Prisma.Decimal
) {
  if (payments.length === 0)
    throw new Error("A sale requires at least one payment.")
  const paid = payments.reduce((sum, payment) => {
    const amount = money(payment.amount)
    if (!amount.gt(0)) throw new Error("Payment amounts must be positive.")
    return sum.plus(amount)
  }, new Prisma.Decimal(0))
  if (!paid.equals(total))
    throw new Error("Split payments must equal the sale total.")
}

import { Prisma } from "@prisma/client"

import { assertPaymentTotal, calculateSaleTotals } from "@/lib/sales-validation"
import { prisma } from "@/lib/prisma"
import { PERMISSIONS } from "@/lib/rbac"
import {
  assertAnyPermission,
  assertOrganizationAccess,
  type AuthorizationContext,
} from "@lib/server/auth"

type PaymentInput = {
  method: "BANK_TRANSFER" | "CARD" | "CASH" | "DIRECT_DEBIT" | "OTHER"
  amount: string | number
  reference?: string
}

function assertSalesWrite(
  context: AuthorizationContext,
  organizationId: string
) {
  assertOrganizationAccess(context, organizationId)
  assertAnyPermission(context, [
    PERMISSIONS.FINANCE_INVOICE_WRITE,
    PERMISSIONS.FINANCE_PAYMENT_WRITE,
  ])
}

export async function searchProducts(
  context: AuthorizationContext,
  organizationId: string,
  query: string
) {
  assertOrganizationAccess(context, organizationId)
  const term = query.trim()
  return prisma.product.findMany({
    where: {
      organizationId,
      active: true,
      ...(term
        ? {
            OR: [
              { sku: { contains: term, mode: "insensitive" } },
              { barcode: { contains: term, mode: "insensitive" } },
              { name: { contains: term, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { name: "asc" },
    take: 50,
  })
}

export async function createSale(
  context: AuthorizationContext,
  organizationId: string,
  input: {
    receiptNo: string
    idempotencyKey: string
    customerId?: string
    terminalId?: string
    shiftId?: string
    promotionId?: string
    lines: Array<{
      productId: string
      quantity: string | number
      discount?: string | number
    }>
    payments: PaymentInput[]
    accounting?: {
      periodId: string
      debitAccountId: string
      creditAccountId: string
    }
  }
) {
  assertSalesWrite(context, organizationId)

  return prisma.$transaction(async (tx) => {
    const existing = await tx.sale.findFirst({
      where: { organizationId, idempotencyKey: input.idempotencyKey },
      include: { lines: true, payments: true },
    })
    if (existing) return existing

    const products = await tx.product.findMany({
      where: {
        organizationId,
        active: true,
        id: { in: input.lines.map((line) => line.productId) },
      },
      select: { id: true, name: true, unitPrice: true, taxRate: true },
    })
    if (
      products.length !==
      new Set(input.lines.map((line) => line.productId)).size
    ) {
      throw new Error(
        "Every sale product must be active and belong to the organization."
      )
    }

    if (input.customerId) {
      const customer = await tx.customer.findFirst({
        where: { id: input.customerId, organizationId, active: true },
        select: { id: true },
      })
      if (!customer)
        throw new Error("Customer was not found in the organization.")
    }

    if (input.shiftId) {
      const shift = await tx.cashierShift.findFirst({
        where: { id: input.shiftId, organizationId, status: "OPEN" },
        select: { id: true, terminalId: true },
      })
      if (!shift) throw new Error("An open cashier shift is required.")
      if (input.terminalId && input.terminalId !== shift.terminalId) {
        throw new Error(
          "The cashier shift does not belong to the selected terminal."
        )
      }
    }

    const byId = new Map(products.map((product) => [product.id, product]))
    const totals = calculateSaleTotals(
      input.lines.map((line) => {
        const product = byId.get(line.productId)!
        return {
          productId: product.id,
          description: product.name,
          quantity: line.quantity,
          unitPrice: product.unitPrice,
          taxRate: product.taxRate,
          discount: line.discount,
        }
      })
    )
    assertPaymentTotal(input.payments, totals.total)

    if (input.accounting) {
      const [period, accounts] = await Promise.all([
        tx.financialPeriod.findFirst({
          where: {
            id: input.accounting.periodId,
            organizationId,
            status: "OPEN",
          },
          select: { id: true },
        }),
        tx.financialAccount.findMany({
          where: {
            organizationId,
            status: "ACTIVE",
            id: {
              in: [
                input.accounting.debitAccountId,
                input.accounting.creditAccountId,
              ],
            },
          },
          select: { id: true },
        }),
      ])
      if (!period || accounts.length !== 2) {
        throw new Error(
          "Sales can only post to an open period and active accounts."
        )
      }
    }

    const sale = await tx.sale.create({
      data: {
        organizationId,
        receiptNo: input.receiptNo.trim(),
        idempotencyKey: input.idempotencyKey,
        customerId: input.customerId,
        terminalId: input.terminalId,
        shiftId: input.shiftId,
        promotionId: input.promotionId,
        subtotal: totals.subtotal,
        discount: totals.discount,
        tax: totals.tax,
        total: totals.total,
        lines: {
          create: totals.lines.map((line) => ({
            productId: line.productId,
            description: line.description,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            discount: line.discount,
            tax: line.tax,
            total: line.total,
          })),
        },
        payments: {
          create: input.payments.map((payment) => ({
            method: payment.method,
            amount: new Prisma.Decimal(payment.amount).toDecimalPlaces(2),
            reference: payment.reference,
          })),
        },
      },
      include: { lines: true, payments: true },
    })

    if (input.accounting) {
      await tx.journalEntry.create({
        data: {
          organizationId,
          periodId: input.accounting.periodId,
          entryNo: `SALE-${sale.receiptNo}`,
          status: "POSTED",
          source: "SALE",
          sourceId: sale.id,
          idempotencyKey: `sale:${input.idempotencyKey}`,
          description: `Sale ${sale.receiptNo}`,
          postedAt: new Date(),
          lines: {
            create: [
              {
                accountId: input.accounting.debitAccountId,
                debit: totals.total,
                credit: 0,
                referenceType: "Sale",
                referenceId: sale.id,
              },
              {
                accountId: input.accounting.creditAccountId,
                debit: 0,
                credit: totals.total,
                referenceType: "Sale",
                referenceId: sale.id,
              },
            ],
          },
        },
      })
    }

    return sale
  })
}

export async function createRefund(
  context: AuthorizationContext,
  organizationId: string,
  input: {
    saleId: string
    amount: string | number
    method: PaymentInput["method"]
    idempotencyKey: string
    returnId?: string
  }
) {
  assertSalesWrite(context, organizationId)
  const amount = new Prisma.Decimal(input.amount).toDecimalPlaces(2)
  if (!amount.gt(0)) throw new Error("Refund amount must be positive.")

  return prisma.$transaction(async (tx) => {
    const existing = await tx.refund.findFirst({
      where: { organizationId, idempotencyKey: input.idempotencyKey },
    })
    if (existing) return existing

    const sale = await tx.sale.findFirst({
      where: { id: input.saleId, organizationId, status: { not: "VOIDED" } },
      select: { id: true, total: true },
    })
    if (!sale) throw new Error("Sale was not found in the organization.")

    const refunded = await tx.refund.aggregate({
      where: { saleId: sale.id, status: "COMPLETED" },
      _sum: { amount: true },
    })
    if (amount.gt(sale.total.minus(refunded._sum.amount ?? 0))) {
      throw new Error("Refund exceeds the remaining refundable sale amount.")
    }

    return tx.refund.create({
      data: {
        organizationId,
        saleId: sale.id,
        returnId: input.returnId,
        amount,
        method: input.method,
        status: "COMPLETED",
        idempotencyKey: input.idempotencyKey,
        refundedAt: new Date(),
      },
    })
  })
}

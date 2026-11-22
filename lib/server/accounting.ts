import { Prisma } from "@prisma/client"

import {
  validateJournalLines,
  type JournalLineInput,
} from "@/lib/accounting-validation"
import { prisma } from "@/lib/prisma"
import { PERMISSIONS } from "@/lib/rbac"
import {
  assertAnyPermission,
  assertOrganizationAccess,
  type AuthorizationContext,
} from "@lib/server/auth"

export type JournalPostingInput = {
  periodId: string
  entryNo: string
  source: "MANUAL" | "INVOICE" | "PAYMENT" | "SALE" | "REFUND" | "ADJUSTMENT"
  sourceId?: string
  idempotencyKey?: string
  description: string
  lines: JournalLineInput[]
}

const decimal = (value: string | number | undefined) =>
  new Prisma.Decimal(value ?? 0)

function assertFinanceWrite(
  context: AuthorizationContext,
  organizationId: string
) {
  assertOrganizationAccess(context, organizationId)
  assertAnyPermission(context, [
    PERMISSIONS.FINANCE_INVOICE_WRITE,
    PERMISSIONS.FINANCE_PAYMENT_WRITE,
  ])
}

export async function createFinancialAccount(
  context: AuthorizationContext,
  input: {
    organizationId: string
    code: string
    name: string
    type: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE"
    parentId?: string
    currency?: string
  }
) {
  assertFinanceWrite(context, input.organizationId)

  if (input.parentId) {
    const parent = await prisma.financialAccount.findFirst({
      where: { id: input.parentId, organizationId: input.organizationId },
      select: { id: true },
    })
    if (!parent) throw new Error("Parent account is outside the organization.")
  }

  return prisma.financialAccount.create({
    data: {
      organizationId: input.organizationId,
      code: input.code.trim(),
      name: input.name.trim(),
      type: input.type,
      parentId: input.parentId,
      currency: input.currency ?? "USD",
    },
  })
}

export async function createFinancialPeriod(
  context: AuthorizationContext,
  input: {
    organizationId: string
    name: string
    startsAt: Date
    endsAt: Date
  }
) {
  assertFinanceWrite(context, input.organizationId)
  if (input.endsAt <= input.startsAt) {
    throw new Error("A financial period must end after it starts.")
  }

  const overlap = await prisma.financialPeriod.findFirst({
    where: {
      organizationId: input.organizationId,
      startsAt: { lt: input.endsAt },
      endsAt: { gt: input.startsAt },
    },
    select: { id: true },
  })
  if (overlap) throw new Error("Financial periods cannot overlap.")

  return prisma.financialPeriod.create({
    data: {
      organizationId: input.organizationId,
      name: input.name.trim(),
      startsAt: input.startsAt,
      endsAt: input.endsAt,
    },
  })
}

export async function closeFinancialPeriod(
  context: AuthorizationContext,
  organizationId: string,
  periodId: string
) {
  assertFinanceWrite(context, organizationId)
  return prisma.$transaction(async (tx) => {
    const period = await tx.financialPeriod.findFirst({
      where: { id: periodId, organizationId, status: "OPEN" },
      select: { id: true },
    })
    if (!period) throw new Error("An open financial period was not found.")

    return tx.financialPeriod.update({
      where: { id: period.id },
      data: { status: "CLOSED", closedAt: new Date() },
    })
  })
}

export async function postJournalEntry(
  context: AuthorizationContext,
  organizationId: string,
  input: JournalPostingInput
) {
  assertFinanceWrite(context, organizationId)
  validateJournalLines(input.lines)

  return prisma.$transaction(async (tx) => {
    if (input.idempotencyKey) {
      const existing = await tx.journalEntry.findFirst({
        where: { organizationId, idempotencyKey: input.idempotencyKey },
        include: { lines: true },
      })
      if (existing) return existing
    }

    const period = await tx.financialPeriod.findFirst({
      where: { id: input.periodId, organizationId, status: "OPEN" },
      select: { id: true },
    })
    if (!period)
      throw new Error("Journal entries can only be posted to an open period.")

    const accountIds = [...new Set(input.lines.map((line) => line.accountId))]
    const accounts = await tx.financialAccount.findMany({
      where: { organizationId, id: { in: accountIds }, status: "ACTIVE" },
      select: { id: true },
    })
    if (accounts.length !== accountIds.length) {
      throw new Error(
        "Every journal account must be active and belong to the organization."
      )
    }

    return tx.journalEntry.create({
      data: {
        organizationId,
        periodId: period.id,
        entryNo: input.entryNo.trim(),
        status: "POSTED",
        source: input.source,
        sourceId: input.sourceId,
        idempotencyKey: input.idempotencyKey,
        description: input.description.trim(),
        postedAt: new Date(),
        lines: {
          create: input.lines.map((line) => ({
            accountId: line.accountId,
            debit: decimal(line.debit),
            credit: decimal(line.credit),
            description: line.description,
            referenceType: line.referenceType,
            referenceId: line.referenceId,
          })),
        },
      },
      include: { lines: true },
    })
  })
}

export async function getTrialBalance(
  context: AuthorizationContext,
  organizationId: string,
  periodId: string
) {
  assertOrganizationAccess(context, organizationId)

  const rows = await prisma.journalLine.findMany({
    where: {
      journalEntry: {
        organizationId,
        periodId,
        status: "POSTED",
      },
    },
    select: {
      accountId: true,
      debit: true,
      credit: true,
      account: {
        select: { code: true, name: true, type: true, currency: true },
      },
    },
  })

  const balances = new Map<
    string,
    {
      accountId: string
      code: string
      name: string
      type: string
      currency: string
      debit: Prisma.Decimal
      credit: Prisma.Decimal
    }
  >()

  for (const row of rows) {
    const current = balances.get(row.accountId) ?? {
      accountId: row.accountId,
      code: row.account.code,
      name: row.account.name,
      type: row.account.type,
      currency: row.account.currency,
      debit: new Prisma.Decimal(0),
      credit: new Prisma.Decimal(0),
    }
    current.debit = current.debit.plus(row.debit)
    current.credit = current.credit.plus(row.credit)
    balances.set(row.accountId, current)
  }

  return [...balances.values()]
}

export async function getIncomeStatement(
  context: AuthorizationContext,
  organizationId: string,
  periodId: string
) {
  assertOrganizationAccess(context, organizationId)
  const rows = await prisma.journalLine.findMany({
    where: {
      journalEntry: { organizationId, periodId, status: "POSTED" },
      account: { type: { in: ["REVENUE", "EXPENSE"] } },
    },
    select: {
      accountId: true,
      debit: true,
      credit: true,
      account: {
        select: { code: true, name: true, type: true, currency: true },
      },
    },
  })

  const balances = new Map<string, Prisma.Decimal>()
  for (const row of rows) {
    const current = balances.get(row.accountId) ?? new Prisma.Decimal(0)
    const balance =
      row.account.type === "REVENUE"
        ? current.plus(row.credit).minus(row.debit)
        : current.plus(row.debit).minus(row.credit)
    balances.set(row.accountId, balance)
  }

  return rows.reduce<
    Array<{
      accountId: string
      code: string
      name: string
      type: string
      currency: string
      amount: Prisma.Decimal
    }>
  >((result, row) => {
    if (result.some((item) => item.accountId === row.accountId)) return result
    result.push({
      accountId: row.accountId,
      code: row.account.code,
      name: row.account.name,
      type: row.account.type,
      currency: row.account.currency,
      amount: balances.get(row.accountId) ?? new Prisma.Decimal(0),
    })
    return result
  }, [])
}

export async function reconcileBankTransaction(
  context: AuthorizationContext,
  organizationId: string,
  input: { transactionId: string; status: "MATCHED" | "EXCLUDED" }
) {
  assertFinanceWrite(context, organizationId)
  const transaction = await prisma.bankTransaction.findFirst({
    where: { id: input.transactionId, bankAccount: { organizationId } },
    select: { id: true },
  })
  if (!transaction)
    throw new Error("Bank transaction was not found in the organization.")

  return prisma.bankTransaction.update({
    where: { id: transaction.id },
    data: { status: input.status },
  })
}

export async function allocatePayment(
  context: AuthorizationContext,
  organizationId: string,
  input: {
    paymentId: string
    invoiceId: string
    amount: string | number
    idempotencyKey: string
  }
) {
  assertFinanceWrite(context, organizationId)
  const requested = decimal(input.amount)
  if (!requested.gt(0))
    throw new Error("Allocation amount must be greater than zero.")

  return prisma.$transaction(async (tx) => {
    const existing = await tx.paymentAllocation.findFirst({
      where: { organizationId, idempotencyKey: input.idempotencyKey },
    })
    if (existing) return existing

    const [payment, invoice] = await Promise.all([
      tx.payment.findFirst({
        where: { id: input.paymentId, organizationId, status: "SUCCEEDED" },
        select: { id: true, amount: true },
      }),
      tx.invoice.findFirst({
        where: { id: input.invoiceId, organizationId },
        select: { id: true, total: true, amountPaid: true },
      }),
    ])

    if (!payment)
      throw new Error("Successful payment was not found in the organization.")
    if (!invoice) throw new Error("Invoice was not found in the organization.")

    const allocated = await tx.paymentAllocation.aggregate({
      where: { paymentId: payment.id },
      _sum: { amount: true },
    })
    const paymentRemaining = payment.amount.minus(allocated._sum.amount ?? 0)
    const invoiceRemaining = invoice.total.minus(invoice.amountPaid)

    if (requested.gt(paymentRemaining)) {
      throw new Error("Allocation exceeds the payment's remaining amount.")
    }
    if (requested.gt(invoiceRemaining)) {
      throw new Error("Allocation exceeds the invoice's outstanding balance.")
    }

    const allocation = await tx.paymentAllocation.create({
      data: {
        organizationId,
        paymentId: payment.id,
        invoiceId: invoice.id,
        idempotencyKey: input.idempotencyKey,
        amount: requested,
      },
    })

    await tx.invoice.update({
      where: { id: invoice.id },
      data: { amountPaid: { increment: requested } },
    })

    return allocation
  })
}

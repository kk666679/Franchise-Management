import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import {
  assertOrganizationAccess,
  assertPermission,
  type AuthorizationContext,
} from "@lib/server/auth"
import { PERMISSIONS } from "@/lib/rbac"
import { NotFoundError, ValidationError } from "@lib/server/errors"

function money(value: string | number | Prisma.Decimal) {
  return new Prisma.Decimal(value).toDecimalPlaces(2)
}

function toCents(value: Prisma.Decimal | number | string | null | undefined) {
  if (value == null) return 0
  return Math.round(Number(new Prisma.Decimal(value).toDecimalPlaces(2).toString()) * 100)
}

function assertPosRead(ctx: AuthorizationContext, organizationId: string) {
  assertOrganizationAccess(ctx, organizationId)
  assertPermission(ctx, PERMISSIONS.SALES_READ)
}

function assertPosWrite(ctx: AuthorizationContext, organizationId: string) {
  assertOrganizationAccess(ctx, organizationId)
  assertPermission(ctx, PERMISSIONS.SALES_WRITE)
}

export async function listPosLocations(ctx: AuthorizationContext) {
  assertPosRead(ctx, ctx.organizationId)
  return prisma.franchiseLocation.findMany({
    where: { organizationId: ctx.organizationId },
    orderBy: [{ name: "asc" }],
    select: {
      id: true,
      name: true,
      code: true,
      status: true,
      locationType: true,
      businessStatus: true,
      addressLine1: true,
      city: true,
      state: true,
      country: true,
      latitude: true,
      longitude: true,
      brand: { select: { id: true, name: true } },
      assignedTerritory: { select: { id: true, name: true, territoryCode: true } },
    },
  })
}

export async function listPosRegisters(ctx: AuthorizationContext, locationId?: string) {
  assertPosRead(ctx, ctx.organizationId)
  return prisma.posTerminal.findMany({
    where: {
      organizationId: ctx.organizationId,
      ...(locationId ? { locationId } : {}),
    },
    orderBy: [{ code: "asc" }],
    include: {
      shifts: {
        where: { status: "OPEN" },
        orderBy: { openedAt: "desc" },
        take: 1,
      },
    },
  })
}

export async function ensurePosRegister(
  ctx: AuthorizationContext,
  input: { locationId?: string | null; code: string; name: string }
) {
  assertPosWrite(ctx, ctx.organizationId)
  if (input.locationId) {
    const location = await prisma.franchiseLocation.findFirst({
      where: { id: input.locationId, organizationId: ctx.organizationId },
      select: { id: true },
    })
    if (!location) throw new NotFoundError("Location not found")
  }
  return prisma.posTerminal.upsert({
    where: {
      organizationId_code: { organizationId: ctx.organizationId, code: input.code.trim() },
    },
    update: {
      name: input.name.trim(),
      locationId: input.locationId ?? null,
      active: true,
    },
    create: {
      organizationId: ctx.organizationId,
      locationId: input.locationId ?? null,
      code: input.code.trim(),
      name: input.name.trim(),
      active: true,
    },
  })
}

export async function getActiveShift(ctx: AuthorizationContext, terminalId: string) {
  assertPosRead(ctx, ctx.organizationId)
  const terminal = await prisma.posTerminal.findFirst({
    where: { id: terminalId, organizationId: ctx.organizationId },
    select: { id: true },
  })
  if (!terminal) throw new NotFoundError("Register not found")
  return prisma.cashierShift.findFirst({
    where: { organizationId: ctx.organizationId, terminalId, status: "OPEN" },
    include: { terminal: true },
    orderBy: { openedAt: "desc" },
  })
}

export async function openPosShift(
  ctx: AuthorizationContext,
  input: { terminalId: string; openingFloat: string | number }
) {
  assertPosWrite(ctx, ctx.organizationId)
  const terminal = await prisma.posTerminal.findFirst({
    where: { id: input.terminalId, organizationId: ctx.organizationId, active: true },
    select: { id: true },
  })
  if (!terminal) throw new NotFoundError("Register not found or inactive")

  const existing = await prisma.cashierShift.findFirst({
    where: { organizationId: ctx.organizationId, terminalId: input.terminalId, status: "OPEN" },
    select: { id: true },
  })
  if (existing) throw new ValidationError("Register already has an open shift")

  return prisma.cashierShift.create({
    data: {
      organizationId: ctx.organizationId,
      terminalId: input.terminalId,
      cashierId: ctx.userId,
      status: "OPEN",
      openingFloat: money(input.openingFloat),
    },
    include: { terminal: true },
  })
}

export async function closePosShift(
  ctx: AuthorizationContext,
  input: { shiftId: string; countedCash: string | number }
) {
  assertPosWrite(ctx, ctx.organizationId)
  const shift = await prisma.cashierShift.findFirst({
    where: { id: input.shiftId, organizationId: ctx.organizationId },
    include: { terminal: true, sales: { include: { payments: true } } },
  })
  if (!shift) throw new NotFoundError("Shift not found")
  if (shift.status !== "OPEN") throw new ValidationError("Shift is already closed")

  const cashSales = shift.sales
    .filter((s) => s.status === "COMPLETED")
    .flatMap((s) => s.payments)
    .filter((p) => p.method === "CASH" && p.status === "SUCCEEDED")
    .reduce((sum, p) => sum.plus(p.amount), new Prisma.Decimal(0))
  const expectedCash = money(shift.openingFloat).plus(money(cashSales))
  const countedCash = money(input.countedCash)
  const variance = money(countedCash.minus(expectedCash))

  return prisma.cashierShift.update({
    where: { id: shift.id },
    data: {
      status: "CLOSED",
      closedAt: new Date(),
      expectedCash,
      countedCash,
      variance,
    },
    include: { terminal: true },
  })
}

export async function listPosProducts(ctx: AuthorizationContext, q?: string) {
  assertPosRead(ctx, ctx.organizationId)
  const term = q?.trim()
  return prisma.product.findMany({
    where: {
      organizationId: ctx.organizationId,
      active: true,
      ...(term
        ? {
            OR: [
              { name: { contains: term, mode: "insensitive" } },
              { sku: { contains: term, mode: "insensitive" } },
              { barcode: { contains: term, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { name: "asc" },
    take: 100,
  })
}

export async function createPosSale(
  ctx: AuthorizationContext,
  input: {
    receiptNo: string
    idempotencyKey: string
    terminalId?: string | null
    shiftId?: string | null
    customerId?: string | null
    lines: Array<{ productId: string; quantity: number; discount?: number }>
    payments: Array<{ method: "CASH" | "CARD" | "BANK_TRANSFER" | "DIRECT_DEBIT" | "OTHER"; amount: string | number; reference?: string }>
  }
) {
  assertPosWrite(ctx, ctx.organizationId)
  if (!input.receiptNo?.trim()) throw new ValidationError("receiptNo is required")
  if (!input.idempotencyKey?.trim()) throw new ValidationError("idempotencyKey is required")
  if (!Array.isArray(input.lines) || input.lines.length === 0) throw new ValidationError("At least one line is required")
  if (!Array.isArray(input.payments) || input.payments.length === 0) throw new ValidationError("At least one payment is required")

  return prisma.$transaction(async (tx) => {
    const existing = await tx.sale.findFirst({
      where: { organizationId: ctx.organizationId, idempotencyKey: input.idempotencyKey },
      include: { lines: true, payments: true },
    })
    if (existing) return existing

    if (input.shiftId) {
      const shift = await tx.cashierShift.findFirst({
        where: { id: input.shiftId, organizationId: ctx.organizationId, status: "OPEN" },
        select: { id: true, terminalId: true },
      })
      if (!shift) throw new ValidationError("Open shift not found")
      if (input.terminalId && input.terminalId !== shift.terminalId) {
        throw new ValidationError("Shift does not belong to selected terminal")
      }
    }

    const productIds = [...new Set(input.lines.map((l) => l.productId))]
    const products = await tx.product.findMany({
      where: { organizationId: ctx.organizationId, active: true, id: { in: productIds } },
      select: { id: true, name: true, unitPrice: true, taxRate: true },
    })
    if (products.length !== productIds.length) throw new ValidationError("One or more products are invalid")

    const byId = new Map(products.map((p) => [p.id, p]))
    let subtotal = new Prisma.Decimal(0)
    let discountTotal = new Prisma.Decimal(0)
    let taxTotal = new Prisma.Decimal(0)
    const lines = input.lines.map((line) => {
      const product = byId.get(line.productId)!
      const qty = new Prisma.Decimal(line.quantity)
      if (!qty.gt(0)) throw new ValidationError("Quantity must be positive")
      const discount = money(line.discount ?? 0)
      const gross = money(product.unitPrice).mul(qty)
      if (discount.gt(gross)) throw new ValidationError("Discount exceeds line gross")
      const net = gross.minus(discount)
      const tax = money(net.mul(new Prisma.Decimal(product.taxRate)).div(100))
      const total = money(net.plus(tax))
      subtotal = subtotal.plus(gross)
      discountTotal = discountTotal.plus(discount)
      taxTotal = taxTotal.plus(tax)
      return {
        productId: product.id,
        description: product.name,
        quantity: qty,
        unitPrice: money(product.unitPrice),
        discount,
        tax,
        total,
      }
    })

    const total = money(subtotal.minus(discountTotal).plus(taxTotal))
    const paid = input.payments.reduce((sum, p) => sum.plus(money(p.amount)), new Prisma.Decimal(0))
    if (!paid.equals(total)) throw new ValidationError("Payments must equal sale total")

    const sale = await tx.sale.create({
      data: {
        organizationId: ctx.organizationId,
        receiptNo: input.receiptNo.trim(),
        idempotencyKey: input.idempotencyKey,
        terminalId: input.terminalId ?? null,
        shiftId: input.shiftId ?? null,
        customerId: input.customerId ?? null,
        status: "COMPLETED",
        subtotal: money(subtotal),
        discount: money(discountTotal),
        tax: money(taxTotal),
        total,
        lines: { create: lines },
        payments: {
          create: input.payments.map((p) => ({
            method: p.method,
            amount: money(p.amount),
            reference: p.reference,
            status: "SUCCEEDED",
          })),
        },
      },
      include: { lines: true, payments: true },
    })

    return sale
  })
}

export function mapPosRegisterView(register: any, location?: any) {
  const openShift = register.shifts?.[0] ?? null
  return {
    id: register.id,
    code: register.code,
    name: register.name,
    locationId: register.locationId,
    locationName: location?.name ?? null,
    active: register.active,
    openShift: openShift
      ? {
          id: openShift.id,
          openedAtIso: openShift.openedAt.toISOString(),
          openingFloatCents: toCents(openShift.openingFloat),
        }
      : null,
  }
}

export function mapPosShiftView(shift: any) {
  return {
    id: shift.id,
    registerId: shift.terminalId,
    openedAtIso: shift.openedAt.toISOString(),
    closedAtIso: shift.closedAt ? shift.closedAt.toISOString() : null,
    openingFloatCents: toCents(shift.openingFloat),
    closingTotalCents: shift.countedCash == null ? null : toCents(shift.countedCash),
    expectedCashCents: shift.expectedCash == null ? null : toCents(shift.expectedCash),
    varianceCents: shift.variance == null ? null : toCents(shift.variance),
    currency: "USD",
    registerName: shift.terminal?.name ?? null,
  }
}

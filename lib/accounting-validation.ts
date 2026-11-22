import { Prisma } from "@prisma/client"

export type JournalLineInput = {
  accountId: string
  debit?: string | number
  credit?: string | number
  description?: string
  referenceType?: string
  referenceId?: string
}

const decimal = (value: string | number | undefined) =>
  new Prisma.Decimal(value ?? 0)

export function validateJournalLines(lines: JournalLineInput[]) {
  if (lines.length < 2) {
    throw new Error("A journal entry must contain at least two lines.")
  }

  let debits = new Prisma.Decimal(0)
  let credits = new Prisma.Decimal(0)

  for (const line of lines) {
    const debit = decimal(line.debit)
    const credit = decimal(line.credit)

    if (debit.isNegative() || credit.isNegative()) {
      throw new Error("Journal line amounts cannot be negative.")
    }
    if (debit.gt(0) && credit.gt(0)) {
      throw new Error(
        "A journal line cannot contain both a debit and a credit."
      )
    }
    if (debit.eq(0) && credit.eq(0)) {
      throw new Error("A journal line must contain a debit or a credit.")
    }

    debits = debits.plus(debit)
    credits = credits.plus(credit)
  }

  if (!debits.gt(0) || !debits.eq(credits)) {
    throw new Error(
      "Journal debits and credits must be equal and greater than zero."
    )
  }

  return { debits, credits }
}

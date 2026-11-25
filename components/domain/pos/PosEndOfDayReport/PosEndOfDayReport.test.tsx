import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { PosEndOfDayReport } from "./PosEndOfDayReport"

const report = {
  registerId: "r1", registerName: "REG-01", openedAtIso: "2026-11-25T08:00:00Z", closedAtIso: "2026-11-25T17:00:00Z",
  openingFloatCents: 10000, cashSalesCents: 5000, cardSalesCents: 3000, otherSalesCents: 0, refundsCents: 0,
  expectedCashCents: 15000, countedCashCents: 15000, varianceCents: 0, currency: "USD",
}

it("renders z-report", () => {
  render(<PosEndOfDayReport report={report} />)
  expect(screen.getByLabelText(/end of day report/i)).toBeInTheDocument()
  expect(screen.getByText(/REG-01/)).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<PosEndOfDayReport report={report} />)
  expect((await axe(container)).violations).toEqual([])
})

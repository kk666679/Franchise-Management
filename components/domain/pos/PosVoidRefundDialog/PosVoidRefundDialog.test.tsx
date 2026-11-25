import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { PosVoidRefundDialog } from "./PosVoidRefundDialog"

it("renders trigger", () => {
  render(<PosVoidRefundDialog mode="void" receiptNumber="R-1" onConfirm={async () => {}} />)
  expect(screen.getByRole("button", { name: /void sale/i })).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<PosVoidRefundDialog mode="refund" receiptNumber="R-1" onConfirm={async () => {}} />)
  expect((await axe(container)).violations).toEqual([])
})

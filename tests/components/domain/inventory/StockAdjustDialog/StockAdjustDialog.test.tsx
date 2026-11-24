import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { StockAdjustDialog } from "./StockAdjustDialog"

it("renders trigger", () => {
  render(<StockAdjustDialog onAdjust={async () => {}} />)
  expect(
    screen.getByRole("button", { name: /Adjust stock/i })
  ).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<StockAdjustDialog onAdjust={async () => {}} />)
  expect((await axe(container)).violations).toEqual([])
})

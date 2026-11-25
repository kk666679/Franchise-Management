import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { PosDiscountPicker } from "./PosDiscountPicker"

it("renders discount input", () => {
  render(<PosDiscountPicker discounts={[]} onApplyCode={async () => {}} onRemove={() => {}} />)
  expect(screen.getByLabelText(/discount code/i)).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<PosDiscountPicker discounts={[]} onApplyCode={async () => {}} onRemove={() => {}} />)
  expect((await axe(container)).violations).toEqual([])
})

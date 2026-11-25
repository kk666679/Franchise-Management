import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { PosCart } from "./PosCart"

it("renders empty cart", () => {
  render(<PosCart items={[]} onQtyChange={() => {}} onRemove={() => {}} />)
  expect(screen.getByText(/cart is empty/i)).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<PosCart items={[]} onQtyChange={() => {}} onRemove={() => {}} />)
  expect((await axe(container)).violations).toEqual([])
})

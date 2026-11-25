import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { PosCashDrawer } from "./PosCashDrawer"

it("renders cash drawer controls", () => {
  render(<PosCashDrawer onOpenDrawer={() => {}} onCashMove={() => {}} />)
  expect(screen.getByRole("button", { name: /open drawer/i })).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<PosCashDrawer onOpenDrawer={() => {}} onCashMove={() => {}} />)
  expect((await axe(container)).violations).toEqual([])
})

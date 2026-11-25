import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { PosOrderTypePicker } from "./PosOrderTypePicker"

it("renders order types", () => {
  render(<PosOrderTypePicker value="dine_in" onChange={() => {}} />)
  expect(screen.getByRole("radiogroup", { name: /order type/i })).toBeInTheDocument()
  expect(screen.getByRole("button", { name: /takeaway/i })).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<PosOrderTypePicker value="takeaway" onChange={() => {}} />)
  expect((await axe(container)).violations).toEqual([])
})

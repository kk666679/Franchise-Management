import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { PosModifierPicker } from "./PosModifierPicker"

it("renders modifiers", () => {
  render(<PosModifierPicker itemName="Latte" options={[{ id: "m1", name: "Oat milk", priceCents: 50, selected: false }]} onChange={() => {}} />)
  expect(screen.getByText("Oat milk")).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<PosModifierPicker itemName="Latte" options={[]} onChange={() => {}} />)
  expect((await axe(container)).violations).toEqual([])
})

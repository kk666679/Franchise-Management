import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { PosComboBuilder } from "./PosComboBuilder"

it("renders combo slots", () => {
  render(<PosComboBuilder name="Lunch" slots={[{ id: "s1", label: "Drink", options: [{ id: "d1", name: "Cola" }] }]} onSelect={() => {}} onConfirm={() => {}} />)
  expect(screen.getByText(/build combo: lunch/i)).toBeInTheDocument()
  expect(screen.getByRole("button", { name: "Cola" })).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<PosComboBuilder name="Lunch" slots={[]} onSelect={() => {}} onConfirm={() => {}} />)
  expect((await axe(container)).violations).toEqual([])
})

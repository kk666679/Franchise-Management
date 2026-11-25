import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { PosSplitBill } from "./PosSplitBill"

it("renders split bill", () => {
  render(<PosSplitBill items={[]} groups={[{ id: "g1", label: "Seat 1", itemIds: [] }]} onAssign={() => {}} onCreateGroup={() => {}} />)
  expect(screen.getByText(/split bill/i)).toBeInTheDocument()
  expect(screen.getByRole("button", { name: /add split/i })).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<PosSplitBill items={[]} groups={[]} onAssign={() => {}} onCreateGroup={() => {}} />)
  expect((await axe(container)).violations).toEqual([])
})

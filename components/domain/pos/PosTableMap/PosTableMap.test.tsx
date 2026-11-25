import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { PosTableMap } from "./PosTableMap"

it("renders tables", () => {
  render(<PosTableMap tables={[{ id: "t1", label: "T1", seats: 2, status: "available" }]} onSelect={() => {}} />)
  expect(screen.getByRole("listbox", { name: /table map/i })).toBeInTheDocument()
  expect(screen.getByRole("option", { name: /T1/i })).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<PosTableMap tables={[]} onSelect={() => {}} />)
  expect((await axe(container)).violations).toEqual([])
})

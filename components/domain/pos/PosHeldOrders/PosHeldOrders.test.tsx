import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { PosHeldOrders } from "./PosHeldOrders"

it("renders held orders", () => {
  render(<PosHeldOrders orders={[{ id: "h1", label: "Table 2", itemCount: 3, totalCents: 1200, currency: "USD", createdAtIso: "2026-11-25T09:00:00Z" }]} onResume={() => {}} />)
  expect(screen.getByText("Table 2")).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<PosHeldOrders orders={[]} onResume={() => {}} />)
  expect((await axe(container)).violations).toEqual([])
})

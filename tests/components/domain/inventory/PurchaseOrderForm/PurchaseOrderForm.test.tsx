import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { PurchaseOrderForm } from "./PurchaseOrderForm"

it("renders form", () => {
  render(<PurchaseOrderForm onSubmit={async () => {}} />)
  expect(screen.getByLabelText(/Supplier/i)).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<PurchaseOrderForm onSubmit={async () => {}} />)
  expect((await axe(container)).violations).toEqual([])
})

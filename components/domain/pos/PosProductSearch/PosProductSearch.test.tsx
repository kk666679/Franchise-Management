import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { PosProductSearch } from "./PosProductSearch"

const products = [
  { id: "p1", name: "Coffee", sku: "COF-1", priceCents: 300, currency: "USD", inStock: 10 },
]

it("renders search input", () => {
  render(<PosProductSearch products={products} onSelect={() => {}} />)
  expect(screen.getByLabelText(/search products/i)).toBeInTheDocument()
  expect(screen.getByText("Coffee")).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<PosProductSearch products={products} onSelect={() => {}} />)
  expect((await axe(container)).violations).toEqual([])
})

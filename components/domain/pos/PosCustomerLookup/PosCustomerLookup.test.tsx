import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { PosCustomerLookup } from "./PosCustomerLookup"

it("renders customer lookup", () => {
  render(<PosCustomerLookup customer={null} onSearch={async () => {}} onClear={() => {}} />)
  expect(screen.getByLabelText(/customer lookup/i)).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<PosCustomerLookup customer={null} onSearch={async () => {}} onClear={() => {}} />)
  expect((await axe(container)).violations).toEqual([])
})

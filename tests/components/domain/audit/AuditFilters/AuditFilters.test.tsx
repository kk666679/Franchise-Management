import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { AuditFilters } from "./AuditFilters"

it("renders filters", () => {
  render(<AuditFilters value={{}} onChange={() => {}} />)
  expect(screen.getByLabelText(/Actor/i)).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<AuditFilters value={{}} onChange={() => {}} />)
  expect((await axe(container)).violations).toEqual([])
})

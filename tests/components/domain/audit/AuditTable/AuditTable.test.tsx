import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { AuditTable } from "./AuditTable"

it("renders empty state when no data", () => {
  render(<AuditTable data={[]} />)
  expect(screen.getByText(/No audit events/i)).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<AuditTable data={[]} />)
  expect((await axe(container)).violations).toEqual([])
})

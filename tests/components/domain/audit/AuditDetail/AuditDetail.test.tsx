import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { AuditDetail } from "./AuditDetail"

const event = {
  id: "a1",
  actorName: "Jane",
  action: "UPDATE",
  entityType: "Franchise",
  entityId: "f1",
  occurredAtIso: "2026-01-01T10:00:00.000Z",
  summary: "Updated name",
}

it("renders detail", () => {
  render(<AuditDetail event={event} />)
  expect(screen.getByText("Jane")).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<AuditDetail event={event} />)
  expect((await axe(container)).violations).toEqual([])
})

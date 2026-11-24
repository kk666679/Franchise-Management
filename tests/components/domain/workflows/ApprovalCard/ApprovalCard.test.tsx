import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { ApprovalCard } from "./ApprovalCard"

const approval = {
  id: "a1",
  title: "Approve budget",
  requesterName: "Jane",
  status: "pending" as const,
  createdAtIso: "2026-01-01T00:00:00.000Z",
  summary: "Budget request",
}

it("renders card", () => {
  render(<ApprovalCard approval={approval} />)
  expect(screen.getByText("Approve budget")).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<ApprovalCard approval={approval} />)
  expect((await axe(container)).violations).toEqual([])
})

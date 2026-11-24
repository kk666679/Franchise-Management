import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { WorkflowStatusBadge } from "./WorkflowStatusBadge"

it("renders status", () => {
  render(<WorkflowStatusBadge status="pending" />)
  expect(screen.getByLabelText(/Workflow status: Pending/)).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<WorkflowStatusBadge status="approved" />)
  expect((await axe(container)).violations).toEqual([])
})

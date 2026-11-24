import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { ApprovalDecisionDialog } from "./ApprovalDecisionDialog"

it("renders trigger", () => {
  render(
    <ApprovalDecisionDialog
      decision="approved"
      triggerLabel="Approve"
      onConfirm={async () => {}}
    />
  )
  expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(
    <ApprovalDecisionDialog
      decision="rejected"
      triggerLabel="Reject"
      onConfirm={async () => {}}
    />
  )
  expect((await axe(container)).violations).toEqual([])
})

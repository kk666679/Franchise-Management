import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { ApprovalTimeline } from "./ApprovalTimeline"

it("renders timeline", () => {
  render(
    <ApprovalTimeline
      steps={[
        {
          id: "s1",
          label: "Review",
          status: "active",
          actorName: null,
          actedAtIso: null,
        },
      ]}
    />
  )
  expect(screen.getByLabelText(/Approval timeline/)).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<ApprovalTimeline steps={[]} />)
  expect((await axe(container)).violations).toEqual([])
})

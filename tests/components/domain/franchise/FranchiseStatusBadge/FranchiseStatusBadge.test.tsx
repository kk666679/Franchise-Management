import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { FranchiseStatusBadge } from "./FranchiseStatusBadge"

it.each(["draft", "active", "suspended", "terminated"] as const)(
  "renders label and aria-label for %s",
  (status) => {
    render(<FranchiseStatusBadge status={status} />)
    expect(screen.getByLabelText(/Franchise status:/i)).toBeInTheDocument()
  }
)

it("has no a11y violations", async () => {
  const { container } = render(<FranchiseStatusBadge status="active" />)
  expect((await axe(container)).violations).toEqual([])
})

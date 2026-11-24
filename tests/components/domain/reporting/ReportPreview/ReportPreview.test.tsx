import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { ReportPreview } from "./ReportPreview"

it("renders empty state", () => {
  render(<ReportPreview rows={[]} />)
  expect(screen.getByText(/No preview data/i)).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<ReportPreview rows={[]} />)
  expect((await axe(container)).violations).toEqual([])
})

import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { DocumentVersionList } from "./DocumentVersionList"

it("renders empty state when no data", () => {
  render(<DocumentVersionList data={[]} />)
  expect(screen.getByText(/No versions/i)).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<DocumentVersionList data={[]} />)
  expect((await axe(container)).violations).toEqual([])
})

import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { DocumentList } from "./DocumentList"

it("renders empty state when no data", () => {
  render(<DocumentList data={[]} />)
  expect(screen.getByText(/No documents/i)).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<DocumentList data={[]} />)
  expect((await axe(container)).violations).toEqual([])
})

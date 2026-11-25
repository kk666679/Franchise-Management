import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { PosCoursePanel } from "./PosCoursePanel"

it("renders course sections", () => {
  render(<PosCoursePanel items={[]} onMove={() => {}} />)
  expect(screen.getByLabelText("Starters")).toBeInTheDocument()
  expect(screen.getByLabelText("Mains")).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<PosCoursePanel items={[]} onMove={() => {}} />)
  expect((await axe(container)).violations).toEqual([])
})

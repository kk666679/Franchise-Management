import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { TaskList } from "./TaskList"

it("renders empty state", () => {
  render(<TaskList tasks={[]} />)
  expect(screen.getByText(/No tasks/i)).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<TaskList tasks={[]} />)
  expect((await axe(container)).violations).toEqual([])
})

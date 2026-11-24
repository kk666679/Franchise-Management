import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { EmployeeTable } from "./EmployeeTable"

it("renders empty state when no data", () => {
  render(<EmployeeTable data={[]} />)
  expect(screen.getByText(/No employees/i)).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<EmployeeTable data={[]} />)
  expect((await axe(container)).violations).toEqual([])
})

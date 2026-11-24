import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { ReportFilterPanel } from "./ReportFilterPanel"

it("renders panel", () => {
  render(<ReportFilterPanel filters={[]} onChange={() => {}} />)
  expect(screen.getByText(/No filters/i)).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(
    <ReportFilterPanel filters={[]} onChange={() => {}} />
  )
  expect((await axe(container)).violations).toEqual([])
})

import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { ReportBuilder } from "./ReportBuilder"

it("renders builder", () => {
  render(
    <ReportBuilder
      columns={[]}
      filters={[]}
      onColumnsChange={() => {}}
      onFiltersChange={() => {}}
      onRun={() => {}}
    />
  )
  expect(screen.getByText(/Report builder/)).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(
    <ReportBuilder
      columns={[]}
      filters={[]}
      onColumnsChange={() => {}}
      onFiltersChange={() => {}}
      onRun={() => {}}
    />
  )
  expect((await axe(container)).violations).toEqual([])
})

import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { FranchiseTable } from "./FranchiseTable"
import type { FranchiseView } from "../mappers"

const rows: FranchiseView[] = [
  {
    id: "f1",
    name: "Acme North",
    legalName: "Acme North LLC",
    status: "active",
    organizationName: "Acme Inc",
    territoryName: "North Region",
    branchCount: 3,
    createdAtIso: "2025-01-15T00:00:00.000Z",
  },
]

it("renders franchise rows", () => {
  render(<FranchiseTable data={rows} />)
  expect(screen.getByText("Acme North")).toBeInTheDocument()
  expect(screen.getByText("Acme Inc")).toBeInTheDocument()
  expect(screen.getByText("3")).toBeInTheDocument()
})

it("renders empty state when no data", () => {
  render(<FranchiseTable data={[]} />)
  expect(screen.getByText(/no franchises yet/i)).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<FranchiseTable data={rows} />)
  expect((await axe(container)).violations).toEqual([])
})

import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { PosSyncStatus } from "./PosSyncStatus"

it("renders sync entries", () => {
  render(<PosSyncStatus entries={[{ id: "o1", clientOpId: "op-1", status: "pending", retryCount: 0, createdAtIso: "2026-11-25T09:00:00Z" }]} />)
  expect(screen.getByLabelText(/pos sync status/i)).toBeInTheDocument()
  expect(screen.getByText(/op-1/i)).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<PosSyncStatus entries={[]} />)
  expect((await axe(container)).violations).toEqual([])
})

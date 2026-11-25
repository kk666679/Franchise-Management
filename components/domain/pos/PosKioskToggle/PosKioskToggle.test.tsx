import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { PosKioskToggle } from "./PosKioskToggle"

it("renders kiosk toggle", () => {
  render(<PosKioskToggle active={false} onToggle={() => {}} />)
  expect(screen.getByRole("button", { name: /enter kiosk mode/i })).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<PosKioskToggle active={false} onToggle={() => {}} />)
  expect((await axe(container)).violations).toEqual([])
})

import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { EdgeSignalBadge } from "./EdgeSignalBadge"

it("renders signal", () => {
  render(<EdgeSignalBadge signal={{ id: "1", kind: "fraud", severity: "critical", message: "High risk" }} />)
  expect(screen.getByLabelText(/fraud signal: critical/i)).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<EdgeSignalBadge signal={{ id: "1", kind: "upsell", severity: "info", message: "Suggest add-on" }} />)
  expect((await axe(container)).violations).toEqual([])
})

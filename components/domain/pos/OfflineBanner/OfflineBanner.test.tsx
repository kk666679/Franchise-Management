import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { OfflineBanner } from "./OfflineBanner"

it("renders offline state", () => {
  render(<OfflineBanner offline pendingCount={2} />)
  expect(screen.getByRole("status")).toHaveTextContent(/offline mode/i)
  expect(screen.getByText(/2 pending/i)).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<OfflineBanner offline={false} />)
  expect((await axe(container)).violations).toEqual([])
})

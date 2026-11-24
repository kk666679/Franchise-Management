import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { NotificationItem } from "./NotificationItem"

const n = {
  id: "n1",
  title: "Hello",
  body: "World",
  read: false,
  createdAtIso: "2026-01-01T00:00:00.000Z",
  kind: "info" as const,
}

it("renders item", () => {
  render(<NotificationItem notification={n} />)
  expect(screen.getByText("Hello")).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<NotificationItem notification={n} />)
  expect((await axe(container)).violations).toEqual([])
})

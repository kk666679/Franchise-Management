import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { NotificationBell } from "./NotificationBell"

it("renders unread count", () => {
  render(<NotificationBell unreadCount={2} />)
  expect(screen.getByLabelText(/Notifications (2 unread)/)).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<NotificationBell unreadCount={0} />)
  expect((await axe(container)).violations).toEqual([])
})

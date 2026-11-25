import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { PosRegisterStatus } from "./PosRegisterStatus"

it("renders register status", () => {
  render(<PosRegisterStatus register={{ id: "r1", name: "REG-01", status: "open" }} session={null} />)
  expect(screen.getByLabelText(/register status/i)).toHaveTextContent(/REG-01/)
})

it("has no a11y violations", async () => {
  const { container } = render(<PosRegisterStatus register={{ id: "r1", name: "REG-01", status: "open" }} />)
  expect((await axe(container)).violations).toEqual([])
})

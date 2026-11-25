import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { ShiftPanel } from "./ShiftPanel"

it("renders open button when no active session", () => {
  render(<ShiftPanel session={null} onOpenRegister={async () => {}} onCloseRegister={async () => {}} />)
  expect(screen.getByRole("button", { name: /open register/i })).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<ShiftPanel session={null} onOpenRegister={async () => {}} onCloseRegister={async () => {}} />)
  expect((await axe(container)).violations).toEqual([])
})

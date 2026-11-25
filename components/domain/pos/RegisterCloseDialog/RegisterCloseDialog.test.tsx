import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { RegisterCloseDialog } from "./RegisterCloseDialog"

it("renders trigger", () => {
  render(<RegisterCloseDialog onCloseRegister={async () => {}} />)
  expect(screen.getByRole("button", { name: /close register/i })).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<RegisterCloseDialog onCloseRegister={async () => {}} />)
  expect((await axe(container)).violations).toEqual([])
})

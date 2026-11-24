import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { RegisterOpenDialog } from "./RegisterOpenDialog"

it("renders trigger", () => {
  render(<RegisterOpenDialog onOpenRegister={async () => {}} />)
  expect(
    screen.getByRole("button", { name: /Open register/i })
  ).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(
    <RegisterOpenDialog onOpenRegister={async () => {}} />
  )
  expect((await axe(container)).violations).toEqual([])
})

import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { PaymentForm } from "./PaymentForm"

it("renders payment form", () => {
  render(<PaymentForm onSubmit={async () => {}} />)
  expect(screen.getByLabelText(/Invoice ID/i)).toBeInTheDocument()
  expect(
    screen.getByRole("button", { name: /Record payment/i })
  ).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<PaymentForm onSubmit={async () => {}} />)
  expect((await axe(container)).violations).toEqual([])
})

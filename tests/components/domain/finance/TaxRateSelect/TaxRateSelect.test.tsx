import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { TaxRateSelect } from "./TaxRateSelect"

it("renders tax rate select", () => {
  render(
    <TaxRateSelect
      rates={[
        { id: "t1", name: "VAT", rateBps: 2000, region: "UK", isDefault: true },
      ]}
      value={null}
      onChange={() => {}}
    />
  )
  expect(screen.getByLabelText(/Tax rate/i)).toBeInTheDocument()
  expect(screen.getByRole("option", { name: /VAT/ })).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(
    <TaxRateSelect rates={[]} value={null} onChange={() => {}} />
  )
  expect((await axe(container)).violations).toEqual([])
})

import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { KitchenDisplayHook } from "./KitchenDisplayHook"

it("renders switch", () => {
  render(<KitchenDisplayHook enabled={false} onChange={() => {}} />)
  expect(screen.getByRole("switch", { name: /kitchen routing/i })).toBeInTheDocument()
})

it("has no a11y violations", async () => {
  const { container } = render(<KitchenDisplayHook enabled onChange={() => {}} />)
  expect((await axe(container)).violations).toEqual([])
})

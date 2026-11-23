import { render } from "@testing-library/react"
import { ChartContainer } from "./core/ChartContainer"

describe("ChartContainer", () => {
  it("renders children", () => {
    const { container } = render(<ChartContainer>Hello</ChartContainer>)
    expect(container.textContent).toContain("Hello")
  })
})

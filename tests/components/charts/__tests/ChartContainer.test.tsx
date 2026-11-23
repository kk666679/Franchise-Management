import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { ChartContainer } from "@/components/charts/core/ChartContainer"

describe("ChartContainer", () => {
  it("renders children", () => {
    const { container } = render(<ChartContainer>Hello</ChartContainer>)
    expect(container.textContent).toContain("Hello")
  })
})

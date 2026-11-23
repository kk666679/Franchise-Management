import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { RoyaltyCalculator } from './RoyaltyCalculator'

it('renders calculator', () => {
  render(<RoyaltyCalculator />)
  expect(screen.getByLabelText(/Gross sales/i)).toBeInTheDocument()
  expect(screen.getByText(/Royalty due/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<RoyaltyCalculator />)
  expect(await axe(container)).toHaveNoViolations()
})

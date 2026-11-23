import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { StockMovementLedger } from './StockMovementLedger'

it('renders empty state when no data', () => {
  render(<StockMovementLedger data={[]} />)
  expect(screen.getByText(/No stock movements/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<StockMovementLedger data={[]} />)
  expect(await axe(container)).toHaveNoViolations()
})

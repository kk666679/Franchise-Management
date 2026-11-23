import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { StockLevelBadge } from './StockLevelBadge'

it('renders low stock', () => {
  render(<StockLevelBadge onHand={1} reorderPoint={5} />)
  expect(screen.getByLabelText(/Stock level: Low/)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<StockLevelBadge onHand={10} reorderPoint={2} />)
  expect((await axe(container)).violations).toEqual([])
})

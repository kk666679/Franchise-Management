import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { LowStockBadge } from './LowStockBadge'

it('renders count', () => {
  render(<LowStockBadge count={3} />)
  expect(screen.getByLabelText(/Low stock items: 3/)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<LowStockBadge count={1} />)
  expect((await axe(container)).violations).toEqual([])
})

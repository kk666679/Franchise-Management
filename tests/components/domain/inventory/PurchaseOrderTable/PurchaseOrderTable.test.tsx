import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { PurchaseOrderTable } from './PurchaseOrderTable'

it('renders empty state when no data', () => {
  render(<PurchaseOrderTable data={[]} />)
  expect(screen.getByText(/No purchase orders/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<PurchaseOrderTable data={[]} />)
  expect((await axe(container)).violations).toEqual([])
})

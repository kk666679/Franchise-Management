import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ProductTable } from './ProductTable'

it('renders empty state when no data', () => {
  render(<ProductTable data={[]} />)
  expect(screen.getByText(/No products/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<ProductTable data={[]} />)
  expect((await axe(container)).violations).toEqual([])
})

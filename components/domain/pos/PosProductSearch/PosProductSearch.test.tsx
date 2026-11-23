import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { PosProductSearch } from './PosProductSearch'

it('renders search input', () => {
  render(<PosProductSearch products={[]} onSelect={() => {}} />)
  expect(screen.getByLabelText(/Search products/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<PosProductSearch products={[]} onSelect={() => {}} />)
  expect(await axe(container)).toHaveNoViolations()
})

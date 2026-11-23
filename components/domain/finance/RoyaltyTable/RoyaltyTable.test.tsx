import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { RoyaltyTable } from './RoyaltyTable'

it('renders empty state when no data', () => {
  render(<RoyaltyTable data={[]} />)
  expect(screen.getByText(/No royalties/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<RoyaltyTable data={[]} />)
  expect(await axe(container)).toHaveNoViolations()
})

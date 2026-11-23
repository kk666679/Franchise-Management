import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ShiftScheduler } from './ShiftScheduler'

it('renders empty state', () => {
  render(<ShiftScheduler shifts={[]} />)
  expect(screen.getByText(/No shifts scheduled/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<ShiftScheduler shifts={[]} />)
  expect((await axe(container)).violations).toEqual([])
})

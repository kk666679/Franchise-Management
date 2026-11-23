import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { NotificationCenter } from './NotificationCenter'

it('renders empty state', () => {
  render(<NotificationCenter notifications={[]} />)
  expect(screen.getByText(/No notifications/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<NotificationCenter notifications={[]} />)
  expect((await axe(container)).violations).toEqual([])
})

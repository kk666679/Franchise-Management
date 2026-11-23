import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ContractTimeline } from './ContractTimeline'

it('renders events', () => {
  render(
    <ContractTimeline
      events={[
        {
          id: 'e1',
          status: 'draft',
          atIso: '2025-01-01T00:00:00.000Z',
          actor: 'alice@example.com',
          note: 'Created',
        },
      ]}
    />,
  )
  expect(screen.getByText(/draft/i)).toBeInTheDocument()
  expect(screen.getByText(/alice@example.com/)).toBeInTheDocument()
})

it('renders empty state', () => {
  render(<ContractTimeline events={[]} />)
  expect(screen.getByText(/no events recorded/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<ContractTimeline events={[]} />)
  expect((await axe(container)).violations).toEqual([])
})

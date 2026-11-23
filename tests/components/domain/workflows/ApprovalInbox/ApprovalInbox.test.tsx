import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ApprovalInbox } from './ApprovalInbox'

it('renders empty state', () => {
  render(<ApprovalInbox approvals={[]} />)
  expect(screen.getByText(/No pending approvals/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<ApprovalInbox approvals={[]} />)
  expect((await axe(container)).violations).toEqual([])
})

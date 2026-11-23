import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { NotificationPreferencesForm } from './NotificationPreferencesForm'

it('renders preferences', () => {
  render(<NotificationPreferencesForm initial={[{channel:'email',enabled:true}]} onSave={async () => {}} />)
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<NotificationPreferencesForm initial={[]} onSave={async () => {}} />)
  expect((await axe(container)).violations).toEqual([])
})

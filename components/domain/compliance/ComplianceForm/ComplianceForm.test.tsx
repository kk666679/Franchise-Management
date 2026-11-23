import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ComplianceForm } from './ComplianceForm'

it('renders form', () => {
  render(<ComplianceForm onSubmit={async () => {}} />)
  expect(screen.getByLabelText(/Title/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<ComplianceForm onSubmit={async () => {}} />)
  expect(await axe(container)).toHaveNoViolations()
})

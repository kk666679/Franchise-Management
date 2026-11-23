import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ComplianceStatusBadge } from './ComplianceStatusBadge'

it('renders status', () => {
  render(<ComplianceStatusBadge status="compliant" />)
  expect(screen.getByLabelText(/Compliance status: Compliant/)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<ComplianceStatusBadge status="overdue" />)
  expect(await axe(container)).toHaveNoViolations()
})

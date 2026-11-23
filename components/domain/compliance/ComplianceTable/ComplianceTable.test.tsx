import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ComplianceTable } from './ComplianceTable'

it('renders empty state when no data', () => {
  render(<ComplianceTable data={[]} />)
  expect(screen.getByText(/No compliance records/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<ComplianceTable data={[]} />)
  expect(await axe(container)).toHaveNoViolations()
})

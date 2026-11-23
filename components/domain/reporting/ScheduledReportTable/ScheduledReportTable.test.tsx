import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ScheduledReportTable } from './ScheduledReportTable'

it('renders empty state when no data', () => {
  render(<ScheduledReportTable data={[]} />)
  expect(screen.getByText(/No scheduled reports/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<ScheduledReportTable data={[]} />)
  expect(await axe(container)).toHaveNoViolations()
})

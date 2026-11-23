import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { InvoiceTable } from './InvoiceTable'

it('renders empty state when no data', () => {
  render(<InvoiceTable data={[]} />)
  expect(screen.getByText(/No invoices/i)).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<InvoiceTable data={[]} />)
  expect(await axe(container)).toHaveNoViolations()
})

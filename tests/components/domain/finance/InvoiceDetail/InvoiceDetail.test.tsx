import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { InvoiceDetail } from './InvoiceDetail'

const invoice = { id:'i1', number:'INV-1', franchiseName:'Acme', status:'issued' as const, totalCents:12345, currency:'USD', dueDateIso:'2026-12-01T00:00:00.000Z', issuedAtIso:'2026-11-01T00:00:00.000Z' }

it('renders invoice detail', () => {
  render(<InvoiceDetail invoice={invoice} />)
  expect(screen.getByText(/Invoice INV-1/)).toBeInTheDocument()
  expect(screen.getByText('Acme')).toBeInTheDocument()
})

it('has no a11y violations', async () => {
  const { container } = render(<InvoiceDetail invoice={invoice} />)
  expect((await axe(container)).violations).toEqual([])
})
